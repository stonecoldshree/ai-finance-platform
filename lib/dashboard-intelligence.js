import { detectAnomaly } from "@/lib/anomaly";
import { toMonthValue } from "@/lib/month-range";

function getPreviousMonthValue(monthValue) {
  const [year, month] = monthValue.split("-").map(Number);
  const previousMonthDate = new Date(year, month - 1, 1);
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);

  const previousYear = previousMonthDate.getFullYear();
  const previousMonth = String(previousMonthDate.getMonth() + 1).padStart(2, "0");
  return `${previousYear}-${previousMonth}`;
}

function getMonthProgress(monthValue) {
  const [year, month] = monthValue.split("-").map(Number);
  const now = new Date();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() + 1 === month;

  if (!isCurrentMonth) {
    return 1;
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  return Math.max(0.1, Math.min(1, now.getDate() / daysInMonth));
}

function getCategoryTotals(expenseTransactions) {
  return expenseTransactions.reduce((totals, transaction) => {
    const key = transaction.category || "other-expense";
    totals[key] = (totals[key] || 0) + transaction.amount;
    return totals;
  }, {});
}

export function buildDashboardIntelligence({ transactions, selectedMonth, totalBalance }) {
  const monthTransactions = transactions.filter(
    (transaction) => toMonthValue(transaction.date) === selectedMonth
  );

  const previousMonth = getPreviousMonthValue(selectedMonth);
  const previousMonthTransactions = transactions.filter(
    (transaction) => toMonthValue(transaction.date) === previousMonth
  );

  const monthIncome = monthTransactions
    .filter((transaction) => transaction.type === "INCOME")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const monthExpenses = monthTransactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const previousMonthExpenses = previousMonthTransactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const monthProgress = getMonthProgress(selectedMonth);
  const projectedIncome = monthProgress < 1 ? monthIncome / monthProgress : monthIncome;
  const projectedExpenses = monthProgress < 1 ? monthExpenses / monthProgress : monthExpenses;
  const projectedNet = projectedIncome - projectedExpenses;
  const projectedBalance = totalBalance + projectedNet;

  const expenseTransactions = monthTransactions
    .filter((transaction) => transaction.type === "EXPENSE")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const categoryTotals = getCategoryTotals(expenseTransactions);
  const categoryEntries = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
  const [topCategory, topCategoryAmount = 0] = categoryEntries[0] || ["n/a", 0];
  const topCategoryShare = monthExpenses > 0 ? (topCategoryAmount / monthExpenses) * 100 : 0;

  const recentExpenseAmounts = expenseTransactions.map((transaction) => transaction.amount);
  const anomalyProbe = recentExpenseAmounts.slice(0, 3);
  const anomalyHistory = recentExpenseAmounts.slice(3, 23);
  const anomalies = anomalyProbe
    .map((amount) => detectAnomaly(amount, anomalyHistory))
    .filter((result) => result.isAnomaly);

  const expenseDeltaPct =
    previousMonthExpenses > 0 ?
    ((monthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100 :
    monthExpenses > 0 ?
    100 :
    0;

  const insights = [];

  if (monthIncome > 0 && monthExpenses > monthIncome * 0.85) {
    insights.push({
      type: "warning",
      title: "Budget risk is elevated",
      detail: `Expenses already consumed ${(monthExpenses / monthIncome * 100).toFixed(1)}% of this month's income.`
    });
  } else {
    insights.push({
      type: "success",
      title: "Cashflow is currently healthy",
      detail: `You are retaining ${Math.max(0, (monthIncome - monthExpenses)).toFixed(2)} this month before projection.`
    });
  }

  if (topCategoryShare >= 35) {
    insights.push({
      type: "warning",
      title: "Category concentration detected",
      detail: `${topCategory} accounts for ${topCategoryShare.toFixed(1)}% of this month's expenses.`
    });
  } else {
    insights.push({
      type: "info",
      title: "Spending mix is balanced",
      detail: `Top category (${topCategory}) contributes ${topCategoryShare.toFixed(1)}% of expenses.`
    });
  }

  if (anomalies.length > 0) {
    insights.push({
      type: "warning",
      title: "Unusual expense movement",
      detail: `${anomalies.length} recent transaction(s) sit outside normal spending behavior.`
    });
  } else {
    insights.push({
      type: "success",
      title: "No anomaly signal this month",
      detail: "Recent spending pattern remains within your normal range."
    });
  }

  if (expenseDeltaPct >= 20) {
    insights.push({
      type: "warning",
      title: "Spending has accelerated",
      detail: `Expenses are up ${expenseDeltaPct.toFixed(1)}% versus last month.`
    });
  } else if (expenseDeltaPct <= -10) {
    insights.push({
      type: "success",
      title: "Great momentum versus last month",
      detail: `Expenses are down ${Math.abs(expenseDeltaPct).toFixed(1)}% compared to last month.`
    });
  } else {
    insights.push({
      type: "info",
      title: "Month-over-month spending is steady",
      detail: `Variance is ${Math.abs(expenseDeltaPct).toFixed(1)}% compared to last month.`
    });
  }

  return {
    monthProgress,
    projectedIncome,
    projectedExpenses,
    projectedNet,
    projectedBalance,
    insights: insights.slice(0, 4)
  };
}