import { format } from "date-fns";

export function toMonthValue(dateValue) {
  const date = new Date(dateValue);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function getCurrentMonthValue() {
  return toMonthValue(new Date());
}

export function buildMonthRangeFromTransactions(transactions = []) {
  const currentMonthValue = getCurrentMonthValue();

  if (!transactions.length) {
    return [currentMonthValue];
  }

  const earliestTransactionDate = transactions.reduce((earliest, transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate < earliest ? transactionDate : earliest;
  }, new Date(transactions[0].date));

  const start = new Date(
    earliestTransactionDate.getFullYear(),
    earliestTransactionDate.getMonth(),
    1
  );
  const current = new Date();
  const end = new Date(current.getFullYear(), current.getMonth(), 1);

  const months = [];
  const cursor = new Date(end);

  while (cursor >= start) {
    months.push(toMonthValue(cursor));
    cursor.setMonth(cursor.getMonth() - 1);
  }

  return months;
}

export function formatMonthValue(monthValue) {
  const [year, month] = monthValue.split("-").map(Number);
  return format(new Date(year, month - 1, 1), "MMMM yyyy");
}
