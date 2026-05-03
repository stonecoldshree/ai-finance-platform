"use server";

import { db } from "@/lib/prisma";
import { getAuthUser } from "@/lib/cachedAuth";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { getTranslator } from "@/lib/i18n/translations";

const serializeDecimal = (obj) => {
  const serialized = { ...obj };
  if (obj.balance) {
    serialized.balance = obj.balance.toNumber();
  }
  if (obj.amount) {
    serialized.amount = obj.amount.toNumber();
  }
  return serialized;
};

export async function getAccountWithTransactions(accountId) {
  const user = await getAuthUser();


  const account = await db.account.findFirst({
    where: {
      id: accountId,
      userId: user.id
    },
    include: {
      transactions: {
        orderBy: { date: "desc" }
      },
      _count: {
        select: { transactions: true }
      }
    }
  });

  if (!account) return null;

  return {
    ...serializeDecimal(account),
    transactions: account.transactions.map(serializeDecimal)
  };
}

export async function bulkDeleteTransactions(transactionIds) {
  try {
    const { userId } = await auth();
    const locale = await getLocaleFromCookie();
    const t = getTranslator(locale);
    
    if (!userId) throw new Error(t("errors.unauthorized", {}, "Unauthorized"));

    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) throw new Error(t("errors.userNotFound", {}, "User not found"));


    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: user.id
      }
    });


    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      if (transaction.type === "EXPENSE") {
        acc[transaction.accountId] = (acc[transaction.accountId] || 0) + transaction.amount.toNumber();
      } else if (transaction.type === "INCOME") {
        acc[transaction.accountId] = (acc[transaction.accountId] || 0) - transaction.amount.toNumber();
      } else if (transaction.type === "TRANSFER") {
        acc[transaction.accountId] = (acc[transaction.accountId] || 0) + transaction.amount.toNumber();
        if (transaction.toAccountId) {
          acc[transaction.toAccountId] = (acc[transaction.toAccountId] || 0) - transaction.amount.toNumber();
        }
      }
      return acc;
    }, {});


    await db.$transaction(async (tx) => {

      await tx.transaction.deleteMany({
        where: {
          id: { in: transactionIds },
          userId: user.id
        }
      });


      for (const [accountId, balanceChange] of Object.entries(
        accountBalanceChanges
      )) {
        await tx.account.update({
          where: { id: accountId },
          data: {
            balance: {
              increment: balanceChange
            }
          }
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/account/[id]");

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();
    const locale = await getLocaleFromCookie();
    const t = getTranslator(locale);

    if (!userId) throw new Error(t("errors.unauthorized", {}, "Unauthorized"));

    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) {
      throw new Error(t("errors.userNotFound", {}, "User not found"));
    }


    await db.account.updateMany({
      where: {
        userId: user.id,
        isDefault: true
      },
      data: { isDefault: false }
    });


    const account = await db.account.findFirst({
      where: {
        id: accountId,
        userId: user.id
      }
    });

    if (!account) {
      throw new Error(t("errors.accountNotFound", {}, "Account not found"));
    }

    const updatedAccount = await db.account.update({
      where: {
        id: accountId
      },
      data: { isDefault: true }
    });

    revalidatePath("/dashboard");
    return { success: true, data: serializeTransaction(updatedAccount) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteAccount(accountId) {
  try {
    const { userId } = await auth();
    const locale = await getLocaleFromCookie();
    const t = getTranslator(locale);

    if (!userId) throw new Error(t("errors.unauthorized", {}, "Unauthorized"));

    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) throw new Error(t("errors.userNotFound", {}, "User not found"));


    const account = await db.account.findFirst({
      where: {
        id: accountId,
        userId: user.id
      }
    });

    if (!account) throw new Error(t("errors.accountNotFound", {}, "Account not found"));

    if (account.isDefault) {
      throw new Error(t("errors.cannotDeleteDefault", {}, "Cannot delete the default account. Please set another account as default first."));
    }


    await db.account.delete({
      where: {
        id: accountId
      }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
