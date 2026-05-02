"use server";

import aj from "@/lib/arcjet";
import { db } from "@/lib/prisma";
import { getAuthUser } from "@/lib/cachedAuth";
import { request } from "@arcjet/next";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { sendEmailWithRetry, sendSMSWithRetry } from "@/lib/notification-delivery";
import { formatSMS } from "@/lib/sms-templates";
import EmailTemplate from "@/emails/template";
import { getTranslator } from "@/lib/i18n/translations";
import { getLocaleFromCookie } from "@/lib/i18n/server";

const isDbConnectivityError = (error) => {
  const message = String(error?.message || "").toLowerCase();
  return (
    message.includes("tenant or user not found") ||
    message.includes("error querying the database") ||
    message.includes("can't reach database server") ||
    message.includes("authentication failed") ||
    message.includes("connection")
  );
};

const serializeTransaction = (obj) => {
  const serialized = { ...obj };
  if (obj.balance && typeof obj.balance.toNumber === 'function') {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount && typeof obj.amount.toNumber === 'function') {
    serialized.amount = obj.amount.toNumber();
  }
  return JSON.parse(JSON.stringify(serialized));
};

const hasUserAccountsByUserId = cache(async (userId) => {
  const account = await db.account.findFirst({
    where: { userId },
    select: { id: true }
  });

  return !!account;
});

export async function getUserAccounts() {
  try {
    const user = await getAuthUser();


    const accounts = await db.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        type: true,
        balance: true,
        isDefault: true,
        createdAt: true,
        updatedAt: true,
        userId: true
      }
    });


    const serializedAccounts = accounts.map(serializeTransaction);

    return serializedAccounts;
  } catch (error) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE" || error?.message?.includes("Dynamic server usage")) {
      throw error;
    }
    if (!isDbConnectivityError(error)) {
      console.error("getUserAccounts failed:", error.message);
    }
    return [];
  }
}

export async function hasUserAccounts(userIdOverride) {
  try {
    const userId = userIdOverride || (await getAuthUser()).id;

    if (!userId) {
      return false;
    }

    return await hasUserAccountsByUserId(userId);
  } catch (error) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE" || error?.message?.includes("Dynamic server usage")) {
      throw error;
    }
    if (!isDbConnectivityError(error)) {
      console.error("hasUserAccounts failed:", error.message);
    }
    return false;
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

    const requestLocale = await getLocaleFromCookie();
    const effectiveLocale = requestLocale || user.locale || "en";
    const t = getTranslator(effectiveLocale);


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

    const subject = t("notifications.accountSub", {}, "Account Created - Gullak");
    const notificationTasks = [
      sendEmailWithRetry(
        {
          to: user.email,
          subject,
          templateParams: {
            name: user.name,
            userName: user.name,
            alert_title: subject,
            alert_message: t("notifications.accountAlertMessage", { accountName: account.name }, `Your account ${account.name} was created successfully.`),
            amount: account.balance.toNumber(),
            category: account.type,
            description: account.name
          },
          react: EmailTemplate({
            userName: user.name,
            type: "account-created",
            locale: effectiveLocale,
            data: {
              accountName: account.name,
              balance: account.balance.toNumber(),
              type: account.type
            }
          })
        },
        { attempts: 2, timeoutMs: 7000, baseDelayMs: 300 }
      ).catch((emailError) => {
        console.error("Error sending account creation email:", emailError.message || emailError);
        return null;
      })
    ];

    if (user.phoneNumber) {
      notificationTasks.push(
        sendSMSWithRetry(
          {
            to: user.phoneNumber,
            body: formatSMS("account-created", {
              accountName: account.name,
              accountType: account.type,
              balance: account.balance.toNumber()
            }, effectiveLocale)
          },
          { attempts: 2, timeoutMs: 7000, baseDelayMs: 300 }
        ).catch((smsError) => {
          console.error("Error sending account creation SMS:", smsError.message || smsError);
          return null;
        })
      );
    }

    await Promise.allSettled(notificationTasks);


    const serializedAccount = serializeTransaction(account);

    revalidatePath("/dashboard");
    return { success: true, data: serializedAccount };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getDashboardData(options = {}) {
  const {
    includePreviousMonth = false,
    includeAllMonths = false,
    monthsBack,
    maxRows
  } = options;

  const now = new Date();
  const startOfMonth = includePreviousMonth ?
  new Date(now.getFullYear(), now.getMonth() - 1, 1) :
  new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  try {
    const user = await getAuthUser();


    const where = {
      userId: user.id
    };

    if (!includeAllMonths) {
      where.date = {
        gte: startOfMonth,
        lte: endOfMonth
      };
    } else if (typeof monthsBack === "number" && monthsBack > 0) {
      
      const boundedStart = new Date(now.getFullYear(), now.getMonth() - (monthsBack - 1), 1);
      where.date = {
        gte: boundedStart,
        lte: endOfMonth
      };
    }

    const query = {
      where,
      orderBy: { date: "desc" },
      select: {
        id: true,
        date: true,
        type: true,
        amount: true,
        category: true,
        description: true,
        accountId: true
      }
    };

    const fallbackRows = includeAllMonths ? 3000 : 500;
    query.take = typeof maxRows === "number" && maxRows > 0 ? maxRows : fallbackRows;

    const transactions = await db.transaction.findMany(query);

    return transactions.map(serializeTransaction);
  } catch (error) {
    if (error?.digest === "DYNAMIC_SERVER_USAGE" || error?.message?.includes("Dynamic server usage")) {
      throw error;
    }
    if (!isDbConnectivityError(error)) {
      console.error("getDashboardData failed:", error.message);
    }
    return [];
  }
}
