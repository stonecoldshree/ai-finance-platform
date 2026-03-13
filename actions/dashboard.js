"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { sendEmail } from "./send-email";
import { sendSMS } from "@/lib/twilio";
import { formatSMS } from "@/lib/sms-templates";
import EmailTemplate from "@/emails/template";

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function getUserAccounts() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (!user) {
    throw new Error("User not found");
  }

  try {
    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            transactions: true
          }
        }
      }
    });


    const serializedAccounts = accounts.map(serializeTransaction);

    return serializedAccounts;
  } catch (error) {
    console.error(error.message);
  }
}

export async function createAccount(data) {
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


    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance amount");
    }


    const existingAccounts = await db.account.findMany({
      where: { userId: user.id }
    });



    const shouldBeDefault =
    existingAccounts.length === 0 ? true : data.isDefault;


    if (shouldBeDefault) {
      await db.account.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false }
      });
    }


    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault
      }
    });

    try {
      await sendEmail({
        to: user.email,
        subject: "Account Created - Gullak",
        react: EmailTemplate({
          userName: user.name,
          type: "account-created",
          data: {
            accountName: account.name,
            balance: account.balance.toNumber(),
            type: account.type
          }
        })
      });
    } catch (emailError) {
      console.error("Error sending account creation email:", emailError);
    }


    if (user.phoneNumber) {
      try {
        await sendSMS({
          to: user.phoneNumber,
          body: formatSMS("account-created", {
            accountName: account.name,
            accountType: account.type,
            balance: account.balance.toNumber()
          })
        });
      } catch (smsError) {
        console.error("Error sending account creation SMS:", smsError);
      }
    }


    const serializedAccount = serializeTransaction(account);

    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getDashboardData(options = {}) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const { includePreviousMonth = false, includeAllMonths = false } = options;


  const now = new Date();
  const startOfMonth = includeAllMonths ?
  undefined :
  includePreviousMonth ?
  new Date(now.getFullYear(), now.getMonth() - 1, 1) :
  new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const transactions = await db.transaction.findMany({
    where: {
      userId: user.id,
      ...(includeAllMonths ?
      {
        date: {
          lte: endOfMonth
        }
      } :
      {
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      })
    },
    orderBy: { date: "desc" }
  });

  return transactions.map(serializeTransaction);
}
