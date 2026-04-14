"use server";

import { db } from "@/lib/prisma";
import { getAuthUser } from "@/lib/cachedAuth";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIContent } from "@/lib/gemini";
import { sendEmailWithRetry } from "@/lib/notification-delivery";
import EmailTemplate from "@/emails/template";
import { getTranslator } from "@/lib/i18n/translations";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { getLocalePromptName } from "@/lib/i18n/config";

/**
 * Returns the current month string in "YYYY-MM" format.
 */
function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function buildBudgetSpecificAdvice({ amount, balance, t }) {
  const translate = typeof t === "function" ? t : (_key, _values, fallback) => fallback;
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = Math.max(1, daysInMonth - now.getDate() + 1);
  const weeksLeft = Math.max(1, Math.ceil(daysLeft / 7));

  const weeklyCap = Math.max(200, Math.round(amount / weeksLeft));
  const dailyCap = Math.max(100, Math.round(amount / daysLeft));
  const bufferTarget = Math.max(300, Math.round(balance * 0.2));
  const nonEssentialThreshold = Math.max(250, Math.round(amount * 0.1));

  return [
    translate(
      "notifications.adviceBudgetWeeklyCap",
      { weeksLeft, weeklyCap, dailyCap },
      `For the next ${weeksLeft} week(s), keep total spending below ₹${weeklyCap} per week (about ₹${dailyCap}/day).`
    ),
    translate(
      "notifications.adviceBudgetBuffer",
      { bufferTarget },
      `Maintain a safety buffer of at least ₹${bufferTarget}; pause non-essential purchases whenever balance nears this level.`
    ),
    translate(
      "notifications.adviceBudgetPause",
      { nonEssentialThreshold },
      `Apply a 24-hour pause to any non-essential spend above ₹${nonEssentialThreshold} to reduce impulse purchases.`
    )
  ];
}

function isSpecificTip(tip) {
  if (typeof tip !== "string") return false;
  const trimmed = tip.trim();
  if (trimmed.length < 20) return false;
  return /₹|\d|%/.test(trimmed);
}

function normalizeAdvice(aiAdvice, fallbackAdvice) {
  if (!Array.isArray(aiAdvice)) {
    return fallbackAdvice;
  }

  const cleaned = aiAdvice
    .map((tip) => String(tip || "").replace(/^[-•\s]+/, "").trim())
    .filter(Boolean);

  const merged = [0, 1, 2].map((index) => {
    const candidate = cleaned[index];
    return isSpecificTip(candidate) ? candidate : fallbackAdvice[index];
  });

  return merged;
}

export async function getCurrentBudget(accountId) {
  try {
    const user = await getAuthUser();
    const currentMonth = getCurrentMonth();

    // Try to find a budget for the current month first
    let budget = await db.budget.findFirst({
      where: {
        userId: user.id,
        accountId,
        budgetMonth: currentMonth
      }
    });

    // Fallback: if no monthly budget exists, check for legacy budget (null budgetMonth)
    if (!budget) {
      budget = await db.budget.findFirst({
        where: {
          userId: user.id,
          accountId,
          budgetMonth: null
        }
      });
    }

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        },
        accountId
      },
      _sum: {
        amount: true
      }
    });

    return {
      budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
      currentExpenses: expenses._sum.amount ?
      expenses._sum.amount.toNumber() :
      0
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

/**
 * Returns budget status for all user accounts for the current month.
 * Used by the dashboard to decide whether to show the monthly budget popup.
 */
export async function getAccountsBudgetStatus() {
  try {
    const user = await getAuthUser();
    const currentMonth = getCurrentMonth();

    const accounts = await db.account.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true
      }
    });

    const budgets = await db.budget.findMany({
      where: {
        userId: user.id,
        budgetMonth: currentMonth
      }
    });

    const legacyBudgets = await db.budget.findMany({
      where: {
        userId: user.id,
        budgetMonth: null
      }
    });

    const budgetMap = {};
    for (const b of budgets) {
      budgetMap[b.accountId] = b.amount.toNumber();
    }

    const legacyBudgetMap = {};
    for (const b of legacyBudgets) {
      legacyBudgetMap[b.accountId] = b.amount.toNumber();
    }

    return accounts.map((account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance.toNumber(),
      hasBudgetThisMonth: !!budgetMap[account.id],
      currentBudget: budgetMap[account.id] ?? legacyBudgetMap[account.id] ?? null
    }));
  } catch (error) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE" || error?.message?.includes("Dynamic server usage")) {
      throw error;
    }
    console.error("Error fetching budget status:", error.message || error);
    return [];
  }
}

export async function updateBudget(amount, accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) throw new Error("User not found");

    const requestLocale = await getLocaleFromCookie();
    const effectiveLocale = requestLocale || user.locale || "en";
    const t = getTranslator(effectiveLocale);
    const promptLanguage = getLocalePromptName(effectiveLocale);

    if (!accountId) throw new Error("Account is required");

    const account = await db.account.findFirst({
      where: {
        id: accountId,
        userId: user.id
      }
    });

    if (!account) throw new Error("Account not found");

    if (amount > account.balance.toNumber()) {
      throw new Error(
        `Budget cannot exceed your current balance of ₹${account.balance.toNumber()}`
      );
    }

    const currentMonth = getCurrentMonth();

    const budget = await db.budget.upsert({
      where: {
        userId_accountId_budgetMonth: {
          userId: user.id,
          accountId,
          budgetMonth: currentMonth
        }
      },
      update: {
        amount
      },
      create: {
        userId: user.id,
        accountId,
        amount,
        budgetMonth: currentMonth
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/account-analytics");


    try {
      const balance = account.balance.toNumber();
      const savingsSecured = Math.max(0, balance - amount);
      const fallbackAdvice = buildBudgetSpecificAdvice({ amount, balance, t });

      const prompt = `
        A user has set a monthly budget of ₹${amount}.
        Their current default account balance is ₹${balance}.
        The user has correctly secured at least 50% of their balance (₹${savingsSecured}) for savings/investments.
        Write all advice only in ${promptLanguage} (locale code: ${effectiveLocale}).
        Do not mix in English unless locale code is en.
        
        Provide exactly 3 concise, friendly, and actionable financial tips.
        Each tip must include at least one concrete number (₹ amount, %, or days) and one clear action.
        Avoid vague wording such as "save more" without a numeric target.
        Format strictly as JSON array of strings in the target locale language: ["tip 1", "tip 2", "tip 3"]
      `;

      let advice = [];
      try {
        const aiPromise = generateAIContent(prompt);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("AI generation timed out")), 3000)
        );
        const text = await Promise.race([aiPromise, timeoutPromise]);
        
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        const parsed = JSON.parse(cleanedText);
        advice = normalizeAdvice(parsed, fallbackAdvice);
      } catch (aiError) {
        console.error("AI Advice Error:", aiError);
        advice = fallbackAdvice;
      }

      void sendEmailWithRetry(
        {
          to: user.email,
          subject: t("notifications.budgetSetSub", {}, "Budget Set - Financial Advice"),
          templateParams: {
            name: user.name,
            userName: user.name,
            alert_title: t("notifications.budgetSetSub", {}, "Budget Set - Financial Advice"),
            alert_message: t("notifications.budgetSetAlertMessage", {}, "Your monthly budget is set. Review your balance and follow the tips below."),
            amount,
            category: t("budget.monthlyBudget", {}, "Monthly Budget"),
            description: t("notifications.currentBalanceDesc", { balance }, `Current balance: ${balance}`),
            advice1: advice?.[0] || "",
            advice2: advice?.[1] || "",
            advice3: advice?.[2] || ""
          },
          react: EmailTemplate({
            userName: user.name,
            type: "budget-created",
            locale: effectiveLocale,
            data: {
              budgetAmount: amount,
              balance,
              advice
            }
          })
        },
        { attempts: 2, timeoutMs: 7000, baseDelayMs: 300 }
      ).catch((emailError) => {
        console.error("Error sending budget email:", emailError.message || emailError);
      });
    } catch (emailError) {
      console.error("Error sending budget email:", emailError);
    }

    return {
      success: true,
      data: { ...budget, amount: budget.amount.toNumber() }
    };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: error.message };
  }
}
