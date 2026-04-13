





function truncate(msg, max = 160) {
  if (msg.length <= max) return msg;
  return msg.slice(0, max - 3) + "...";
}

export function formatSMS(type, data) {
  switch (type) {
    case "welcome":
      return formatWelcome(data);
    case "monthly-report":
      return formatMonthlyReport(data);
    case "budget-alert":
      return formatBudgetAlert(data);
    case "budget-coach":
      return formatBudgetCoach(data);
    case "account-created":
      return formatAccountCreated(data);
    case "transaction-success":
      return formatTransactionSuccess(data);
    default:
      return "Gullak: You have a new notification. Check your email for details.";
  }
}

function formatWelcome({ userName }) {
  return truncate(`Welcome to Gullak, ${userName || "there"}! Get started: Create an account, add transactions, and check your dashboard for AI insights.`);
}

function formatMonthlyReport({ stats, month }) {
  const net = stats.totalIncome - stats.totalExpenses;
  const topCategory = Object.entries(stats.byCategory || {}).
  sort(([, a], [, b]) => b - a)[0];

  let msg = `Gullak ${month} Report: Income Rs.${stats.totalIncome} | Expenses Rs.${stats.totalExpenses} | Net Rs.${net}.`;

  if (topCategory) {
    msg += ` Top spend: ${topCategory[0]} (Rs.${topCategory[1]}).`;
  }

  return truncate(msg);
}

function formatBudgetAlert({ percentageUsed, budgetAmount, totalExpenses, accountName }) {
  let msg = `Budget Alert (${accountName}): ${percentageUsed}% used - Rs.${totalExpenses} of Rs.${budgetAmount} budget.`;

  const remaining = (Number(budgetAmount) - Number(totalExpenses)).toFixed(1);
  msg += ` Remaining: Rs.${remaining}.`;

  return truncate(msg);
}

function formatBudgetCoach({ stats }) {
  let msg = `Weekly Budget Coach: Spent Rs.${stats.totalExpenses} this week. Budget remaining: Rs.${stats.remainingBudget}.`;

  return truncate(msg);
}

function formatAccountCreated({ accountName, accountType, balance }) {
  return truncate(`Gullak: Account "${accountName}" created! Type: ${accountType}, Balance: Rs.${balance}.`);
}

function formatTransactionSuccess({ amount, description, category }) {
  return truncate(`Gullak: Rs.${amount} logged for "${description}" (${category}).`);
}
