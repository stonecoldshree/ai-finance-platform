import { getTranslator } from "@/lib/i18n/translations";
import { normalizeCategoryKey } from "@/lib/category-utils";

function truncate(msg, max = 160) {
  if (msg.length <= max) return msg;
  return msg.slice(0, max - 3) + "...";
}

export function formatSMS(type, data, locale = "en") {
  const t = getTranslator(locale);

  switch (type) {
    case "welcome":
      return truncate(t("notifications.welcomeSMS", { userName: data.userName || "there" }));
    case "monthly-report":
      return formatMonthlyReport(data, t);
    case "budget-alert":
      return formatBudgetAlert(data, t);
    case "budget-coach":
      return formatBudgetCoach(data, t);
    case "account-created":
      return truncate(t("notifications.accountCreated", { 
        accountName: data.accountName, 
        accountType: data.accountType, 
        balance: data.balance 
      }));
    case "transaction-success":
      {
        const categoryKey = normalizeCategoryKey(data.category);
        const localizedCategory = t(`categories.${categoryKey}`, {}, data.category || categoryKey);
        
        const amountLabel = t("transaction.amount", {}, "Amount");
        const categoryLabel = t("transaction.category", {}, "Category");
        const noteLabel = t("transaction.description", {}, "Note");
        const balanceLabel = t("budget.balance", {}, "Balance");
        const accountLabel = t("transaction.account", {}, "Account");
        
        let receipt = `💰 *Gullak Transaction*\n`;
        receipt += `${amountLabel}: ₹${data.amount}\n`;
        receipt += `${categoryLabel}: ${localizedCategory}\n`;
        
        if (data.description) {
            receipt += `${noteLabel}: ${data.description}\n`;
        }
        if (data.accountName) {
            receipt += `${accountLabel}: ${data.accountName}\n`;
        }
        if (data.balance !== undefined) {
            receipt += `${balanceLabel}: ₹${data.balance}\n`;
        }
        if (data.advice && data.advice.length > 0) {
            receipt += `\n💡 Tip: ${data.advice[0]}`;
        }
        
        return truncate(receipt, 800);
      }
    default:
      return truncate(t("notifications.defaultSMS"));
  }
}

function formatMonthlyReport({ stats, month }, t) {
  const net = stats.totalIncome - stats.totalExpenses;
  const topCategory = Object.entries(stats.byCategory || {})
    .sort(([, a], [, b]) => b - a)[0];

  let msg = t("notifications.monthlyReport", { 
    month, 
    totalIncome: stats.totalIncome, 
    totalExpenses: stats.totalExpenses, 
    net 
  });

  if (topCategory) {
    const categoryKey = normalizeCategoryKey(topCategory[0]);
    const localizedCategory = t(`categories.${categoryKey}`, {}, topCategory[0]);
    msg += t("notifications.topSpend", { category: localizedCategory, amount: topCategory[1] });
  }

  return truncate(msg);
}

function formatBudgetAlert({ percentageUsed, budgetAmount, totalExpenses, accountName }, t) {
  const remaining = (Number(budgetAmount) - Number(totalExpenses)).toFixed(1);
  return truncate(t("notifications.budgetAlert", { 
    percentageUsed: percentageUsed.toFixed(1),
    accountName,
    totalExpenses: Number(totalExpenses).toFixed(1),
    budgetAmount: Number(budgetAmount).toFixed(1),
    remaining
  }));
}

function formatBudgetCoach({ stats }, t) {
  return truncate(t("notifications.budgetCoach", { 
    totalExpenses: stats.totalExpenses, 
    remainingBudget: stats.remainingBudget 
  }));
}
