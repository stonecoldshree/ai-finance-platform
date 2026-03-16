const INTL_LOCALE_MAP = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  mr: "mr-IN",
  raj: "hi-IN",
  bn: "bn-IN",
  gu: "gu-IN",
  pa: "pa-IN",
  or: "or-IN"
};

export function getIntlLocale(locale = "en") {
  return INTL_LOCALE_MAP[locale] || INTL_LOCALE_MAP.en;
}

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

export function formatMonthValue(monthValue, locale = "en") {
  const [year, month] = monthValue.split("-").map(Number);
  const date = new Date(year, month - 1, 1);

  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    month: "long",
    year: "numeric"
  }).format(date);
}

export function formatDateValue(dateValue, locale = "en") {
  return new Intl.DateTimeFormat(getIntlLocale(locale), {
    dateStyle: "medium"
  }).format(new Date(dateValue));
}
