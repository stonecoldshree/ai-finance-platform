import { inngest } from "./client";
import { db } from "@/lib/prisma";
import EmailTemplate from "@/emails/template";
import { sendEmailWithRetry, sendSMSWithRetry } from "@/lib/notification-delivery";
import { shouldSendEmail, shouldSendSMS } from "@/lib/notification-policy";
import { formatSMS } from "@/lib/sms-templates";
import { generateAIContent } from "@/lib/gemini";
import { detectAnomaly, checkBudgetAnomaly } from "@/lib/anomaly";
import { getTranslator } from "@/lib/i18n/translations";

function getMaxUsersPerRun() {
  const configured = Number(process.env.INNGEST_MAX_USERS_PER_RUN || 25);
  if (Number.isNaN(configured) || configured <= 0) return 25;
  return configured;
}

function shouldUseScheduledAI() {
  return String(process.env.ENABLE_SCHEDULED_AI_INSIGHTS || "false").toLowerCase() === "true";
}

function isSpecificInsight(insight) {
  if (typeof insight !== "string") return false;
  const trimmed = insight.trim();
  if (trimmed.length < 20) return false;
  return /₹|\d|%/.test(trimmed);
}

function normalizeInsights(aiInsights, fallbackInsights) {
  if (!Array.isArray(aiInsights)) {
    return fallbackInsights;
  }

  const cleaned = aiInsights
    .map((insight) => String(insight || "").replace(/^[-•\s]+/, "").trim())
    .filter(Boolean);

  return [0, 1, 2].map((index) => {
    const candidate = cleaned[index];
    return isSpecificInsight(candidate) ? candidate : fallbackInsights[index];
  });
}

function buildSpecificMonthlyInsights(stats, month) {
  const totalIncome = Number(stats.totalIncome || 0);
  const totalExpenses = Number(stats.totalExpenses || 0);
  const netIncome = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  const categoryEntries = Object.entries(stats.byCategory || {});
  const [topCategory = "misc", topCategoryAmount = 0] =
    categoryEntries.sort((a, b) => Number(b[1]) - Number(a[1]))[0] || [];

  const topCategoryShare = totalExpenses > 0 ? (Number(topCategoryAmount) / totalExpenses) * 100 : 0;
  const weeklyExpenseCap = Math.max(400, Math.round(totalExpenses / 4));

  return [
    `${month}: expenses were ₹${totalExpenses.toFixed(0)} against income ₹${totalIncome.toFixed(0)}. Keep next month's savings rate above ${Math.max(10, Math.round(savingsRate)).toFixed(0)}%.`,
    `${topCategory} is your top spend at ₹${Number(topCategoryAmount).toFixed(0)} (${topCategoryShare.toFixed(1)}% of expenses). Set a weekly cap of ₹${Math.max(250, Math.round(Number(topCategoryAmount) / 4))} for this category.`,
    `Set a weekly total expense ceiling of ₹${weeklyExpenseCap}. Review spending every Sunday and trim the largest category by at least 10%.`
  ];
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
  const fallbackInsights = buildSpecificMonthlyInsights(stats, month);

  if (!shouldUseScheduledAI()) {
    return fallbackInsights;

  }

  const prompt = `
    Analyze this financial data and provide 3 concise, actionable insights.
    Focus on spending patterns and practical advice.
    Keep it friendly and conversational.
    Each insight must include at least one concrete number (₹ amount, %, or days) and one specific action.
    Avoid vague guidance without targets.

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
    const parsed = JSON.parse(cleanedText);
    return normalizeInsights(parsed, fallbackInsights);
  } catch (error) {
    console.error("Error generating insights:", error);
    return fallbackInsights;

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
        let monthName = lastMonth.toLocaleString("default", { month: "long" });
        try {
          monthName = new Intl.DateTimeFormat(user.locale || "en", { month: "long" }).format(lastMonth);
        } catch {
          // keep default month label if Intl locale isn't supported
        }


        const insights = await generateFinancialInsights(stats, monthName);
        const t = getTranslator(user.locale);
        const subject = t("notifications.monthlySub", { month: monthName });

        if (shouldSendEmail("monthly-report")) {
          await sendEmailWithRetry({
            to: user.email,
            subject: subject,
            templateParams: {
              name: user.name,
              userName: user.name,
              alert_title: subject,
              alert_message: t("notifications.monthlyAlertMessage", { month: monthName }, `Here is your monthly financial summary for ${monthName}.`),
              amount: stats.totalExpenses,
              category: monthName,
              description: t(
                "notifications.monthlyDesc",
                { totalIncome: stats.totalIncome, net: stats.totalIncome - stats.totalExpenses },
                `Income: ${stats.totalIncome}, Net: ${stats.totalIncome - stats.totalExpenses}`
              ),
              advice1: insights?.[0] || "",
              advice2: insights?.[1] || "",
              advice3: insights?.[2] || ""
            },
            react: EmailTemplate({
              userName: user.name,
              type: "monthly-report",
              locale: user.locale,
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
            body: formatSMS("monthly-report", { stats, month: monthName, insights }, user.locale)
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

          const t = getTranslator(budget.user.locale);
          const baseSubject = t("notifications.budgetSub", { accountName: account.name });
          const subjectStr = anomalousTransactions.length > 0 ? `⚠️ ${baseSubject}` : baseSubject;

          if (shouldSendEmail("budget-alert")) {
            await sendEmailWithRetry({
              to: budget.user.email,
              subject: subjectStr,
              templateParams: {
                name: budget.user.name,
                userName: budget.user.name,
                alert_title: subjectStr,
                alert_message: anomalousTransactions.length > 0 ?
                t(
                  "notifications.budgetAnomalyAlertMessage",
                  {},
                  "We detected unusual spending patterns in your account. Please review recent transactions."
                ) :
                t(
                  "notifications.budgetUsageAlertMessage",
                  { percentageUsed: budgetCheck.percentageUsed.toFixed(1) },
                  `You have used ${budgetCheck.percentageUsed.toFixed(1)}% of your monthly budget.`
                ),
                amount: totalExpenses,
                category: account.name,
                description: t("notifications.budgetAmountDesc", { budgetAmount }, `Budget amount: ${budgetAmount}`)
              },
              react: EmailTemplate({
                userName: budget.user.name,
                type: "budget-alert",
                locale: budget.user.locale,
                data: alertData
              })
            });
          }


          if (shouldSendSMS("budget-alert", Boolean(budget.user.phoneNumber))) {
            await sendSMSWithRetry({
              to: budget.user.phoneNumber,
              body: formatSMS("budget-alert", alertData, budget.user.locale)
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
          const discretionaryCap = Math.max(300, Math.round(weeklyStats.totalExpenses * 0.8));
          const savingsMove = Math.max(250, Math.round(totalBalance * 0.05));
          advice = [
          `For the next 7 days, keep discretionary spending under ₹${discretionaryCap}.`,
          `Move ₹${savingsMove} to a savings bucket before mid-week to reduce overspending pressure.`,
          `Review top 3 expenses every Sunday and cut the largest one by at least 10% next week.`];
        }

        const coachData = {
          stats: {
            totalExpenses: weeklyStats.totalExpenses,
            remainingBudget: budgetAmount - weeklyStats.totalExpenses
          },
          advice
        };

        const t = getTranslator(user.locale);
        const subjectStr = t("notifications.coachSub");

        if (shouldSendEmail("budget-coach")) {
          await sendEmailWithRetry({
            to: user.email,
            subject: subjectStr,
            templateParams: {
              name: user.name,
              userName: user.name,
              alert_title: subjectStr,
              alert_message: t("notifications.coachAlertMessage", {}, "Your weekly budget digest is ready with actionable tips."),
              amount: coachData.stats.totalExpenses,
              category: t("notifications.weeklyDigestCategory", {}, "Weekly Budget Digest"),
              description: t(
                "notifications.remainingBudgetDesc",
                { remainingBudget: coachData.stats.remainingBudget },
                `Remaining monthly budget: ${coachData.stats.remainingBudget}`
              ),
              advice1: advice?.[0] || "",
              advice2: advice?.[1] || "",
              advice3: advice?.[2] || ""
            },
            react: EmailTemplate({
              userName: user.name,
              type: "budget-coach",
              locale: user.locale,
              data: coachData
            })
          });
        }


        if (shouldSendSMS("budget-coach", Boolean(user.phoneNumber))) {
          await sendSMSWithRetry({
            to: user.phoneNumber,
            body: formatSMS("budget-coach", coachData, user.locale)
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
