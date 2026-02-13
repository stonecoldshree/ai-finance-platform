"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIContent } from "@/lib/gemini";
import { sendEmail } from "./send-email";
import EmailTemplate from "@/emails/template";

export async function getCurrentBudget(accountId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const budget = await db.budget.findFirst({
      where: {
        userId: user.id,
      },
    });


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
          lte: endOfMonth,
        },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
      currentExpenses: expenses._sum.amount
        ? expenses._sum.amount.toNumber()
        : 0,
    };
  } catch (error) {
    console.error("Error fetching budget:", error);
    throw error;
  }
}

export async function updateBudget(amount) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) throw new Error("User not found");


    const defaultAccount = await db.account.findFirst({
      where: {
        userId: user.id,
        isDefault: true,
      },
    });

    if (defaultAccount) {
      if (amount > defaultAccount.balance.toNumber()) {
        throw new Error(
          `Budget cannot exceed your current balance of ₹${defaultAccount.balance.toNumber()}`
        );
      }
    }


    const budget = await db.budget.upsert({
      where: {
        userId: user.id,
      },
      update: {
        amount,
      },
      create: {
        userId: user.id,
        amount,
      },
    });

    revalidatePath("/dashboard");


    try {
      const balance = defaultAccount ? defaultAccount.balance.toNumber() : 0;

      const prompt = `
        A user has set a monthly budget of ₹${amount}.
        Their current default account balance is ₹${balance}.
        
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
          "Review your budget weekly.",
        ];
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
            advice,
          },
        }),
      });
    } catch (emailError) {
      console.error("Error sending budget email:", emailError);
    }

    return {
      success: true,
      data: { ...budget, amount: budget.amount.toNumber() },
    };
  } catch (error) {
    console.error("Error updating budget:", error);
    return { success: false, error: error.message };
  }
}
