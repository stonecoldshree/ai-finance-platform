"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { getAuthUser } from "@/lib/cachedAuth";
import { revalidatePath } from "next/cache";
import { generateAIContent } from "@/lib/gemini";
import aj from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { sendEmailWithRetry, sendSMSWithRetry } from "@/lib/notification-delivery";
import { shouldSendEmail, shouldSendSMS } from "@/lib/notification-policy";
import { formatSMS } from "@/lib/sms-templates";
import EmailTemplate from "@/emails/template";
import { add } from "date-fns";

function buildRuleBasedAdvice({ transaction, newBalance, recentTransactions }) {
  const tips = [];
  const amount = transaction.amount.toNumber();
  const category = transaction.category || "this category";

  if (transaction.type === "EXPENSE") {
    const sevenDayCap = Math.max(300, Math.round(amount * 1.2));
    tips.push(`You spent ₹${amount} on ${category}. Keep ${category} spend under ₹${sevenDayCap} over the next 7 days.`);
  } else {
    const saveNow = Math.max(300, Math.round(amount * 0.2));
    tips.push(`Income of ₹${amount} recorded. Move at least ₹${saveNow} to savings within 24 hours.`);
  }

  if (newBalance < 1000) {
    const dailyLimit = Math.max(100, Math.round(newBalance / 7));
    tips.push(`Current balance is ₹${newBalance}. Keep daily non-essential spend under ₹${dailyLimit} for the next 7 days.`);
  } else {
    const reserve = Math.max(500, Math.round(newBalance * 0.2));
    tips.push(`Balance is ₹${newBalance}. Protect at least ₹${reserve} as a reserve before discretionary spending.`);
  }

  const recentExpenseCount = recentTransactions.filter((t) => t.type === "EXPENSE").length;
  if (recentExpenseCount >= 4) {
    tips.push(`You logged ${recentExpenseCount} recent expense entries. Audit subscriptions today and cut 1 recurring charge this week.`);
  } else {
    tips.push(`Recent expense frequency is ${recentExpenseCount} entries. Keep this pace and do a 10-minute spend review every Sunday.`);
  }

  return tips.slice(0, 3);
}

function isSpecificTip(tip) {
  if (typeof tip !== "string") return false;
  const trimmed = tip.trim();
  if (trimmed.length < 20) return false;
  return /₹|\d|%/.test(trimmed);
}

function mergeSpecificAdvice(candidateAdvice, fallbackAdvice) {
  if (!Array.isArray(candidateAdvice)) return fallbackAdvice;

  const cleaned = candidateAdvice
    .map((tip) => String(tip || "").replace(/^[-•\s]+/, "").trim())
    .filter(Boolean);

  return [0, 1, 2].map((index) => {
    const candidate = cleaned[index];
    return isSpecificTip(candidate) ? candidate : fallbackAdvice[index];
  });
}

function shouldUseRealtimeAIAdvice(transaction) {
  if (process.env.ENABLE_REALTIME_AI_ADVICE !== "true") {
    return false;
  }

  const amount = transaction.amount.toNumber();
  return transaction.type === "EXPENSE" && amount >= 1000;
}

const serializeAmount = (obj) => ({
  ...obj,
  amount: obj.amount.toNumber()
});


export async function createTransaction(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");


    const req = await request();


    const decision = await aj.protect(req, {
      userId,
      requested: 1
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        const { remaining, reset } = decision.reason;
        console.error({
          code: "RATE_LIMIT_EXCEEDED",
          details: {
            remaining,
            resetInSeconds: reset
          }
        });

        throw new Error("Too many requests. Please try again later.");
      }

      throw new Error("Request blocked");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findUnique({
      where: {
        id: data.accountId,
        userId: user.id
      }
    });

    if (!account) {
      throw new Error("Account not found");
    }

    if (data.type === "TRANSFER") {
      if (!data.toAccountId) throw new Error("Transfer requires a destination account");
      if (data.accountId === data.toAccountId) throw new Error("Cannot transfer to the same account");
      const destAccount = await db.account.findUnique({
        where: { id: data.toAccountId, userId: user.id }
      });
      if (!destAccount) throw new Error("Destination account not found");
    }

    const balanceChange = data.type === "EXPENSE" || data.type === "TRANSFER" ? -data.amount : data.amount;
    const newBalance = account.balance.toNumber() + balanceChange;

    if (newBalance < 0) {
      throw new Error("Insufficient funds. This transaction would result in a negative balance.");
    }


    const transaction = await db.$transaction(async (tx) => {
      const newTransaction = await tx.transaction.create({
        data: {
          ...data,
          userId: user.id,
          nextRecurringDate:
          data.isRecurring && data.recurringInterval ?
          calculateNextRecurringDate(data.date, data.recurringInterval) :
          null
        }
      });

      await tx.account.update({
        where: { id: data.accountId },
        data: { balance: newBalance }
      });

      if (data.type === "TRANSFER" && data.toAccountId) {
        await tx.account.update({
          where: { id: data.toAccountId },
          data: { balance: { increment: data.amount } }
        });
      }

      return newTransaction;
    });

    let advice = [];
    const recentTransactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        accountId: data.accountId
      },
      orderBy: { date: "desc" },
      take: 8
    });

    advice = buildRuleBasedAdvice({ transaction, newBalance, recentTransactions });
    const fallbackAdvice = advice;

    if (shouldUseRealtimeAIAdvice(transaction)) {
      try {
        const prompt = `
          Rewrite these financial tips in a concise and friendly way.
          Keep exactly 3 bullet points.
          Each bullet must include at least one number (₹ amount, %, or days) and one concrete action.
          Avoid generic phrases like "save more" without a target.
          User Context:
          - Amount: ₹${transaction.amount.toNumber()}
          - Type: ${transaction.type}
          - Category: ${transaction.category}
          - Current Balance: ₹${newBalance}

          Base Tips:
          ${advice.map((tip) => `- ${tip}`).join("\n")}

          Return a JSON array of exactly 3 strings.
        `;

        const text = await generateAIContent(prompt);
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        const rewrittenAdvice = JSON.parse(cleanedText);
        advice = mergeSpecificAdvice(rewrittenAdvice, fallbackAdvice);
      } catch (aiError) {
        console.error("AI Advice Error:", aiError.message);
      }
    }

    try {
      if (shouldSendEmail("transaction-success")) {
        await sendEmailWithRetry({
          to: user.email,
          subject: "New Transaction Logged - Gullak",
          templateParams: {
            name: user.name,
            userName: user.name,
            alert_title: "New Transaction Logged - Gullak",
            alert_message: "A new transaction has been recorded in your account.",
            amount: transaction.amount.toNumber(),
            category: transaction.category,
            description: transaction.description,
            advice1: advice?.[0] || "",
            advice2: advice?.[1] || "",
            advice3: advice?.[2] || ""
          },
          react: EmailTemplate({
            userName: user.name,
            type: "transaction-success",
            data: {
              amount: transaction.amount.toNumber(),
              description: transaction.description,
              category: transaction.category,
              advice
            }
          })
        });
      }
    } catch (emailError) {
      console.error("Error sending transaction email:", emailError.message);
    }


    console.log("SMS CHECK - user.phoneNumber:", user.phoneNumber, "user.email:", user.email);
    if (shouldSendSMS("transaction-success", Boolean(user.phoneNumber))) {
      try {
        console.log("Attempting to send SMS to:", user.phoneNumber);
        const smsResult = await sendSMSWithRetry({
          to: user.phoneNumber,
          body: formatSMS("transaction-success", {
            amount: transaction.amount.toNumber(),
            description: transaction.description,
            category: transaction.category,
            advice
          })
        });
        if (smsResult.success) {
          console.log("Transaction SMS sent:", smsResult.data?.sid);
        } else {
          console.error("SMS failed:", smsResult.error);
        }
      } catch (smsError) {
        console.error("Error sending transaction SMS:", smsError.message);
      }
    }

    revalidatePath("/dashboard");
    revalidatePath(`/account/${transaction.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id
    }
  });

  if (!transaction) throw new Error("Transaction not found");

  return serializeAmount(transaction);
}

export async function updateTransaction(id, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) throw new Error("User not found");


    const originalTransaction = await db.transaction.findUnique({
      where: {
        id,
        userId: user.id
      },
      include: {
        account: true
      }
    });

    if (!originalTransaction) throw new Error("Transaction not found");


    const oldBalanceChange =
    originalTransaction.type === "EXPENSE" ?
    -originalTransaction.amount.toNumber() :
    originalTransaction.amount.toNumber();

    const newBalanceChange =
    data.type === "EXPENSE" ? -data.amount : data.amount;

    const netBalanceChange = newBalanceChange - oldBalanceChange;


    const transaction = await db.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: {
          id,
          userId: user.id
        },
        data: {
          ...data,
          nextRecurringDate:
          data.isRecurring && data.recurringInterval ?
          calculateNextRecurringDate(data.date, data.recurringInterval) :
          null
        }
      });


      await tx.account.update({
        where: { id: data.accountId },
        data: {
          balance: {
            increment: netBalanceChange
          }
        }
      });

      return updated;
    });

    revalidatePath("/dashboard");
    revalidatePath(`/account/${data.accountId}`);

    return { success: true, data: serializeAmount(transaction) };
  } catch (error) {
    throw new Error(error.message);
  }
}


export async function getUserTransactions(query = {}) {
  try {
    const user = await getAuthUser();


    const transactions = await db.transaction.findMany({
      where: {
        userId: user.id,
        ...query
      },
      include: {
        account: true
      },
      orderBy: {
        date: "desc"
      }
    });

    return { success: true, data: transactions };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getRecurringTransactions() {
  const user = await getAuthUser();


  const recurringTransactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      isRecurring: true
    },
    include: {
      account: true
    },
    orderBy: [
    { status: "asc" },
    { nextRecurringDate: "asc" },
    { createdAt: "desc" }]

  });

  const serialized = recurringTransactions.map((item) => ({
    ...item,
    amount: item.amount.toNumber(),
    account: item.account ? { ...item.account, balance: item.account.balance.toNumber() } : null
  }));

  return { success: true, data: serialized };
}

export async function pauseRecurringTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  await db.transaction.update({
    where: {
      id,
      userId: user.id
    },
    data: {
      status: "PENDING"
    }
  });

  revalidatePath("/recurring-transactions");
  return { success: true };
}

export async function resumeRecurringTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  const transaction = await db.transaction.findUnique({
    where: {
      id,
      userId: user.id
    }
  });

  if (!transaction) throw new Error("Recurring transaction not found");

  await db.transaction.update({
    where: {
      id,
      userId: user.id
    },
    data: {
      status: "COMPLETED",
      nextRecurringDate: transaction.nextRecurringDate || calculateNextRecurringDate(new Date(), transaction.recurringInterval)
    }
  });

  revalidatePath("/recurring-transactions");
  return { success: true };
}

export async function updateRecurringInterval(id, interval) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const validIntervals = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];
  if (!validIntervals.includes(interval)) {
    throw new Error("Invalid recurring interval");
  }

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  await db.transaction.update({
    where: {
      id,
      userId: user.id
    },
    data: {
      recurringInterval: interval,
      nextRecurringDate: calculateNextRecurringDate(new Date(), interval),
      status: "COMPLETED"
    }
  });

  revalidatePath("/recurring-transactions");
  return { success: true };
}

export async function disableRecurringTransaction(id) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  await db.transaction.update({
    where: {
      id,
      userId: user.id
    },
    data: {
      isRecurring: false,
      recurringInterval: null,
      nextRecurringDate: null,
      lastProcessed: null,
      status: "COMPLETED"
    }
  });

  revalidatePath("/recurring-transactions");
  return { success: true };
}

function escapeCsvCell(value) {
  const raw = value ?? "";
  const str = String(raw);
  if (str.includes(",") || str.includes("\n") || str.includes("\"")) {
    return `"${str.replace(/\"/g, '""')}"`;
  }
  return str;
}

export async function exportTransactionsCsv({ monthValue = null, accountId = null, type = null } = {}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkUserId: userId } });
  if (!user) throw new Error("User not found");

  let dateFilter = {};
  if (monthValue) {
    const [year, month] = monthValue.split("-").map(Number);
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);
    dateFilter = { gte: startDate, lte: endDate };
  }

  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      ...(accountId ? { accountId } : {}),
      ...(type ? { type } : {}),
      ...(monthValue ? { date: dateFilter } : {})
    },
    take: 5000,
    include: {
      account: true
    },
    orderBy: {
      date: "desc"
    }
  });

  const headers = [
  "Date",
  "Type",
  "Account",
  "Category",
  "Description",
  "Amount",
  "Recurring",
  "Status"];


  const rows = transactions.map((transaction) => [
  new Date(transaction.date).toISOString().split("T")[0],
  transaction.type,
  transaction.account?.name || "",
  transaction.category,
  transaction.description || "",
  transaction.amount.toNumber().toFixed(2),
  transaction.isRecurring ? "Yes" : "No",
  transaction.status]);


  const csv = [headers, ...rows].
  map((row) => row.map(escapeCsvCell).join(",")).
  join("\n");

  const suffix = monthValue || "all-months";
  return {
    success: true,
    data: {
      filename: `gullak-report-${suffix}.csv`,
      csv
    }
  };
}


export async function scanReceipt(fileData) {
  try {
    const prompt = `
      Analyze this receipt image or PDF and extract the following information in JSON format:
      - Total amount (just the number)
      - Date (in ISO format)
      - Description or items purchased (brief summary)
      - Merchant/store name
      - Suggested category (one of: housing,transportation,groceries,utilities,entertainment,food,shopping,healthcare,education,personal,travel,insurance,gifts,bills,other-expense )
      
      Only respond with valid JSON in this exact format:
      {
        "amount": number,
        "date": "ISO date string",
        "description": "string",
        "merchantName": "string",
        "category": "string"
      }

      If its not a recipt, return an empty object
    `;

    const aiPromise = generateAIContent(prompt, {
      inlineData: {
        data: fileData.base64,
        mimeType: fileData.mimeType
      }
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI scan timed out")), 12000)
    );

    const text = await Promise.race([aiPromise, timeoutPromise]);
    console.log("Gemini response:", text);
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    const data = JSON.parse(cleanedText);
    return {
      amount: parseFloat(data.amount),
      date: new Date(data.date),
      description: data.description,
      category: data.category,
      merchantName: data.merchantName
    };
  } catch (error) {
    console.error("Failed to scan receipt:", error.message, error.stack);
    throw new Error("Failed to scan receipt. Please try again.");
  }
}


function calculateNextRecurringDate(startDate, interval) {
  const date = new Date(startDate);

  switch (interval) {
    case "DAILY":
      return add(date, { days: 1 });
    case "WEEKLY":
      return add(date, { weeks: 1 });
    case "MONTHLY":
      return add(date, { months: 1 });
    case "YEARLY":
      return add(date, { years: 1 });
    default:
      return date;
  }
}
