import { detectAnomaly } from "@/lib/anomaly";
import { toMonthValue } from "@/lib/month-range";
import { normalizeCategoryKey } from "@/lib/category-utils";

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
    const key = normalizeCategoryKey(transaction.category || "other-expense");
    totals[key] = (totals[key] || 0) + transaction.amount;
    return totals;
  }, {});
}

const getTranslatorFromInput = (translator) => {
  if (typeof translator !== "function") {
    return (_, fallback) => fallback;
  }

  return (key, fallback, values = {}) => translator(key, values, fallback);
};

export function buildDashboardIntelligence({ transactions, selectedMonth, totalBalance, t }) {
  const translate = getTranslatorFromInput(t);
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
  const topCategoryLabel = translate(`categories.${topCategory}`, topCategory);
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
      title: translate("dashboard.insightBudgetRiskTitle", "Budget risk is elevated"),
      detail: translate(
        "dashboard.insightBudgetRiskDetail",
        `Expenses already consumed ${(monthExpenses / monthIncome * 100).toFixed(1)}% of this month's income.`,
        { pct: (monthExpenses / monthIncome * 100).toFixed(1) }
      )
    });
  } else {
    insights.push({
      type: "success",
      title: translate("dashboard.insightCashflowHealthyTitle", "Cashflow is currently healthy"),
      detail: translate(
        "dashboard.insightCashflowHealthyDetail",
        `You are retaining ${Math.max(0, monthIncome - monthExpenses).toFixed(2)} this month before projection.`,
        { amount: Math.max(0, monthIncome - monthExpenses).toFixed(2) }
      )
    });
  }

  if (topCategoryShare >= 35) {
    insights.push({
      type: "warning",
      title: translate("dashboard.insightCategoryConcentrationTitle", "Category concentration detected"),
      detail: translate(
        "dashboard.insightCategoryConcentrationDetail",
        `${topCategoryLabel} accounts for ${topCategoryShare.toFixed(1)}% of this month's expenses.`,
        { topCategory: topCategoryLabel, pct: topCategoryShare.toFixed(1) }
      )
    });
  } else {
    insights.push({
      type: "info",
      title: translate("dashboard.insightSpendingMixBalancedTitle", "Spending mix is balanced"),
      detail: translate(
        "dashboard.insightSpendingMixBalancedDetail",
        `Top category (${topCategoryLabel}) contributes ${topCategoryShare.toFixed(1)}% of expenses.`,
        { topCategory: topCategoryLabel, pct: topCategoryShare.toFixed(1) }
      )
    });
  }

  if (anomalies.length > 0) {
    insights.push({
      type: "warning",
      title: translate("dashboard.insightUnusualExpenseMovementTitle", "Unusual expense movement"),
      detail: translate(
        "dashboard.insightUnusualExpenseMovementDetail",
        `${anomalies.length} recent transaction(s) sit outside normal spending behavior.`,
        { count: String(anomalies.length) }
      )
    });
  } else {
    insights.push({
      type: "success",
      title: translate("dashboard.insightNoAnomalySignalTitle", "No anomaly signal this month"),
      detail: translate(
        "dashboard.insightNoAnomalySignalDetail",
        "Recent spending pattern remains within your normal range."
      )
    });
  }

  if (expenseDeltaPct >= 20) {
    insights.push({
      type: "warning",
      title: translate("dashboard.insightSpendingAcceleratedTitle", "Spending has accelerated"),
      detail: translate(
        "dashboard.insightSpendingAcceleratedDetail",
        `Expenses are up ${expenseDeltaPct.toFixed(1)}% versus last month.`,
        { pct: expenseDeltaPct.toFixed(1) }
      )
    });
  } else if (expenseDeltaPct <= -10) {
    insights.push({
      type: "success",
      title: translate("dashboard.insightGreatMomentumTitle", "Great momentum versus last month"),
      detail: translate(
        "dashboard.insightGreatMomentumDetail",
        `Expenses are down ${Math.abs(expenseDeltaPct).toFixed(1)}% compared to last month.`,
        { pct: Math.abs(expenseDeltaPct).toFixed(1) }
      )
    });
  } else {
    insights.push({
      type: "info",
      title: translate("dashboard.insightMoMSteadyTitle", "Month-over-month spending is steady"),
      detail: translate(
        "dashboard.insightMoMSteadyDetail",
        `Variance is ${Math.abs(expenseDeltaPct).toFixed(1)}% compared to last month.`,
        { variance: Math.abs(expenseDeltaPct).toFixed(1) }
      )
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