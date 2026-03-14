import { inngest } from "./client";
import { db } from "@/lib/prisma";
import EmailTemplate from "@/emails/template";
import { sendEmailWithRetry, sendSMSWithRetry } from "@/lib/notification-delivery";
import { shouldSendEmail, shouldSendSMS } from "@/lib/notification-policy";
import { formatSMS } from "@/lib/sms-templates";
import { generateAIContent } from "@/lib/gemini";
import { detectAnomaly, checkBudgetAnomaly } from "@/lib/anomaly";

function getMaxUsersPerRun() {
  const configured = Number(process.env.INNGEST_MAX_USERS_PER_RUN || 25);
  if (Number.isNaN(configured) || configured <= 0) return 25;
  return configured;
}

function shouldUseScheduledAI() {
  return String(process.env.ENABLE_SCHEDULED_AI_INSIGHTS || "false").toLowerCase() === "true";
}


export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10,
      period: "1m",
      key: "event.data.userId"
    }
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {

    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    await step.run("process-transaction", async () => {
      const transaction = await db.transaction.findUnique({
        where: {
          id: event.data.transactionId,
          userId: event.data.userId
        },
        include: {
          account: true
        }
      });

      if (!transaction || !isTransactionDue(transaction)) return;


      await db.$transaction(async (tx) => {

        await tx.transaction.create({
          data: {
            type: transaction.type,
            amount: transaction.amount,
            description: `${transaction.description} (Recurring)`,
            date: new Date(),
            category: transaction.category,
            userId: transaction.userId,
            accountId: transaction.accountId,
            isRecurring: false
          }
        });


        const balanceChange =
        transaction.type === "EXPENSE" ?
        -transaction.amount.toNumber() :
        transaction.amount.toNumber();

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: { increment: balanceChange } }
        });


        await tx.transaction.update({
          where: { id: transaction.id },
          data: {
            lastProcessed: new Date(),
            nextRecurringDate: calculateNextRecurringDate(
              new Date(),
              transaction.recurringInterval
            )
          }
        });
      });
    });
  }
);


export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions"
  },
  { cron: "0 0 * * *" },
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        return await db.transaction.findMany({
          where: {
            isRecurring: true,
            status: "COMPLETED",
            OR: [
            { lastProcessed: null },
            {
              nextRecurringDate: {
                lte: new Date()
              }
            }]

          }
        });
      }
    );


    if (recurringTransactions.length > 0) {
      const events = recurringTransactions.map((transaction) => ({
        name: "transaction.recurring.process",
        data: {
          transactionId: transaction.id,
          userId: transaction.userId
        }
      }));


      await inngest.send(events);
    }

    return { triggered: recurringTransactions.length };
  }
);


async function generateFinancialInsights(stats, month) {
  if (!shouldUseScheduledAI()) {
    return [
    `Income: ₹${stats.totalIncome.toFixed(2)} | Expenses: ₹${stats.totalExpenses.toFixed(2)} this month.`,
    "Track your top expense category weekly to stay within budget.",
    "Use recurring transaction review to identify predictable savings."];

  }

  const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.

    Financial Data for ${month}:
    - Total Income: ₹${stats.totalIncome}
    - Total Expenses: ₹${stats.totalExpenses}
    - Net Income: ₹${stats.totalIncome - stats.totalExpenses}
    - Expense Categories: ${Object.entries(stats.byCategory).
  map(([category, amount]) => `${category}: ₹${amount}`).
  join(", ")}

    Format the response as a JSON array of strings, like this:
    ["insight 1", "insight 2", "insight 3"]
  `;

  try {
    const text = await generateAIContent(prompt, null, { priority: "low" });
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();

    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Error generating insights:", error);
    return [
    "Your highest expense category this month might need attention.",
    "Consider setting up a budget for better financial management.",
    "Track your recurring expenses to identify potential savings."];

  }
}

export const generateMonthlyReports = inngest.createFunction(
  {
    id: "generate-monthly-reports",
    name: "Generate Monthly Reports"
  },
  { cron: "0 0 1 * *" },
  async ({ step }) => {
    const maxUsers = getMaxUsersPerRun();
    const users = await step.run("fetch-users", async () => {
      return await db.user.findMany({
        include: { accounts: true },
        take: maxUsers,
        orderBy: { createdAt: "asc" }
      });
    });

    for (const user of users) {
      await step.run(`generate-report-${user.id}`, async () => {
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);

        const stats = await getMonthlyStats(user.id, lastMonth);
        const monthName = lastMonth.toLocaleString("default", {
          month: "long"
        });


        const insights = await generateFinancialInsights(stats, monthName);

        if (shouldSendEmail("monthly-report")) {
          await sendEmailWithRetry({
            to: user.email,
            subject: `Your Monthly Financial Report - ${monthName}`,
            react: EmailTemplate({
              userName: user.name,
              type: "monthly-report",
              data: {
                stats,
                month: monthName,
                insights
              }
            })
          });
        }


        if (shouldSendSMS("monthly-report", Boolean(user.phoneNumber))) {
          await sendSMSWithRetry({
            to: user.phoneNumber,
            body: formatSMS("monthly-report", { stats, month: monthName, insights })
          });
        }
      });
    }

    return { processed: users.length };
  }
);


export const checkBudgetAlerts = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch-budgets", async () => {
      return await db.budget.findMany({
        include: {
          user: true,
          account: true
        }
      });
    });

    for (const budget of budgets) {
      const account = budget.account;
      if (!account) continue;

      await step.run(`check-budget-${budget.id}`, async () => {
        const startDate = new Date();
        startDate.setDate(1);


        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: account.id,
            type: "EXPENSE",
            date: {
              gte: startDate
            }
          },
          _sum: {
            amount: true
          }
        });

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;


        const budgetCheck = checkBudgetAnomaly(totalExpenses, Number(budgetAmount));


        const recentTransactions = await db.transaction.findMany({
          where: {
            userId: budget.userId,
            accountId: account.id,
            type: "EXPENSE"
          },
          orderBy: { date: "desc" },
          take: 100
        });

        const amounts = recentTransactions.map((t) => t.amount.toNumber());
        let anomalousTransactions = [];

        if (amounts.length >= 5) {

          const history = amounts.slice(5);
          const recent = amounts.slice(0, 5);

          anomalousTransactions = recent.
          map((amount, idx) => {
            const result = detectAnomaly(amount, history);
            return result.isAnomaly ?
            { amount, ...result, transaction: recentTransactions[idx] } :
            null;
          }).
          filter(Boolean);
        }


        const shouldAlert =
        budgetCheck.isOverBudget || anomalousTransactions.length > 0;

        if (
        shouldAlert && (
        !budget.lastAlertSent ||
        isNewMonth(new Date(budget.lastAlertSent), new Date())))
        {
          const alertData = {
            percentageUsed: budgetCheck.percentageUsed,
            budgetAmount: parseInt(budgetAmount).toFixed(1),
            totalExpenses: parseInt(totalExpenses).toFixed(1),
            accountName: account.name
          };


          if (anomalousTransactions.length > 0) {
            alertData.anomalies = anomalousTransactions.map((a) => ({
              amount: a.amount,
              zScore: a.zScore,
              threshold: a.threshold,
              description: a.transaction?.description || "Unknown"
            }));
          }

          if (shouldSendEmail("budget-alert")) {
            await sendEmailWithRetry({
              to: budget.user.email,
              subject: anomalousTransactions.length > 0 ?
              `⚠️ Unusual Spending Detected - ${account.name}` :
              `Budget Alert for ${account.name}`,
              react: EmailTemplate({
                userName: budget.user.name,
                type: "budget-alert",
                data: alertData
              })
            });
          }


          if (shouldSendSMS("budget-alert", Boolean(budget.user.phoneNumber))) {
            await sendSMSWithRetry({
              to: budget.user.phoneNumber,
              body: formatSMS("budget-alert", alertData)
            });
          }


          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() }
          });
        }
      });
    }
  }
);


export const generateBudgetCoach = inngest.createFunction(
  {
    id: "generate-budget-coach",
    name: "Generate Weekly Budget Coach"
  },
  { cron: "0 9 * * 1" },
  async ({ step }) => {
    const maxUsers = getMaxUsersPerRun();
    const users = await step.run("fetch-users-coach", async () => {
      return await db.user.findMany({
        include: { accounts: true },
        take: maxUsers,
        orderBy: { createdAt: "asc" }
      });
    });

    for (const user of users) {
      await step.run(`generate-coach-${user.id}`, async () => {
        const weeklyStats = await getWeeklyStats(user.id);

        const defaultAccount = user.accounts.find((a) => a.isDefault);
        let budgetAmount = 0;

        if (defaultAccount) {
          const budget = await db.budget.findFirst({
            where: { userId: user.id, accountId: defaultAccount.id }
          });
          budgetAmount = budget ? budget.amount : 0;
        }

        const totalBalance = user.accounts.reduce(
          (sum, acc) => sum + acc.balance.toNumber(),
          0
        );

        const prompt = `
          Analyze this weekly financial data and provide 3 concise, friendly, and actionable money-saving tips for the upcoming week.
          
          Data:
          - Spent last week: ₹${weeklyStats.totalExpenses}
          - Total Monthly Budget: ₹${budgetAmount}
          - Total Current Balance: ₹${totalBalance}
          
          Format as JSON array of strings: ["tip 1", "tip 2", "tip 3"]
        `;


        let advice = [];
        if (shouldUseScheduledAI()) {
          try {
            const text = await generateAIContent(prompt, null, { priority: "low" });
            const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
            advice = JSON.parse(cleanedText);
          } catch (e) {
            advice = [
            "Check your recurring subscriptions.",
            "Try cooking at home more often.",
            "Review your daily spending habits."];

          }
        } else {
          advice = [
          "Set one weekly category cap and review it every Sunday.",
          "Delay non-essential purchases by 24 hours before confirming.",
          "Track daily expenses consistently for better weekly forecasts."];
        }

        const coachData = {
          stats: {
            totalExpenses: weeklyStats.totalExpenses,
            remainingBudget: budgetAmount - weeklyStats.totalExpenses
          },
          advice
        };

        if (shouldSendEmail("budget-coach")) {
          await sendEmailWithRetry({
            to: user.email,
            subject: "Your Weekly Budget Digest - Gullak",
            react: EmailTemplate({
              userName: user.name,
              type: "budget-coach",
              data: coachData
            })
          });
        }


        if (shouldSendSMS("budget-coach", Boolean(user.phoneNumber))) {
          await sendSMSWithRetry({
            to: user.phoneNumber,
            body: formatSMS("budget-coach", coachData)
          });
        }
      });
    }

    return { processed: users.length };
  }
);

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear());

}


function isTransactionDue(transaction) {

  if (!transaction.lastProcessed) return true;

  const today = new Date();
  const nextDue = new Date(transaction.nextRecurringDate);


  return nextDue <= today;
}

function calculateNextRecurringDate(date, interval) {
  const next = new Date(date);
  switch (interval) {
    case "DAILY":
      next.setDate(next.getDate() + 1);
      break;
    case "WEEKLY":
      next.setDate(next.getDate() + 7);
      break;
    case "MONTHLY":
      next.setMonth(next.getMonth() + 1);
      break;
    case "YEARLY":
      next.setFullYear(next.getFullYear() + 1);
      break;
  }
  return next;
}

async function getMonthlyStats(userId, month) {
  const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
  const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
        stats.byCategory[t.category] =
        (stats.byCategory[t.category] || 0) + amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      byCategory: {},
      transactionCount: transactions.length
    }
  );
}

async function getWeeklyStats(userId) {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 7);

  const transactions = await db.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  return transactions.reduce(
    (stats, t) => {
      const amount = t.amount.toNumber();
      if (t.type === "EXPENSE") {
        stats.totalExpenses += amount;
      } else {
        stats.totalIncome += amount;
      }
      return stats;
    },
    {
      totalExpenses: 0,
      totalIncome: 0,
      transactionCount: transactions.length
    }
  );
}
