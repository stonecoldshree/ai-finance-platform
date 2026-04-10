"use server";

import { db } from "@/lib/prisma";
import { getAuthUser } from "@/lib/cachedAuth";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIContent } from "@/lib/gemini";
import { sendEmail } from "./send-email";
import EmailTemplate from "@/emails/template";

/**
 * Returns the current month string in "YYYY-MM" format.
 */
function getCurrentMonth() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
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

    const budgetMap = {};
    for (const b of budgets) {
      budgetMap[b.accountId] = b.amount.toNumber();
    }

    return accounts.map((account) => ({
      id: account.id,
      name: account.name,
      type: account.type,
      balance: account.balance.toNumber(),
      hasBudgetThisMonth: !!budgetMap[account.id],
      currentBudget: budgetMap[account.id] || null
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
      const effectiveBudget = amount / 2;

      const prompt = `
        A user has set a monthly budget of ₹${amount}.
        Their current default account balance is ₹${balance}.
        The effective spending budget is ₹${effectiveBudget} (50% rule applied — the other 50% is recommended for savings/investment).
        
        Provide 3 concise, friendly, and actionable financial tips on how to utilize their budget and balance effectively.
        Format as JSON array of strings: ["tip 1", "tip 2", "tip 3"]
      `;

      let advice = [];
      try {
        const text = await generateAIContent(prompt);
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        advice = JSON.parse(cleanedText);
      } catch (aiError) {
        console.error("AI Advice Error:", aiError);
        advice = [
        "Track your expenses daily.",
        "Prioritize needs over wants.",
        "Review your budget weekly."];

      }

      await sendEmail({
        to: user.email,
        subject: "Budget Set - Financial Advice",
        react: EmailTemplate({
          userName: user.name,
          type: "budget-created",
          data: {
            budgetAmount: amount,
            balance,
            advice
          }
        })
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
