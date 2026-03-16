"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  ArrowDownRight,
  ArrowUpRight } from
"lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  formatMonthValue,
  toMonthValue } from
"@/lib/month-range";
import { useLanguage } from "@/components/language-provider";

function getPreviousMonthValue(monthValue) {
  const [year, month] = monthValue.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() - 1);

  const prevYear = date.getFullYear();
  const prevMonth = String(date.getMonth() + 1).padStart(2, "0");
  return `${prevYear}-${prevMonth}`;
}

function calculateTrend(current, previous) {
  if (previous === 0) {
    return {
      value: current === 0 ? 0 : 100,
      isPositive: current >= 0,
      isNeutral: current === 0
    };
  }

  const delta = ((current - previous) / Math.abs(previous)) * 100;
  return {
    value: Math.abs(delta),
    isPositive: delta >= 0,
    isNeutral: Math.abs(delta) < 0.1
  };
}

export function DashboardSummary({ accounts, transactions, selectedMonth }) {
  const { t, locale } = useLanguage();

  const stats = useMemo(() => {
    const totalBalance = accounts.reduce(
      (sum, a) => sum + parseFloat(a.balance),
      0
    );

    const monthTransactions = transactions.filter(
      (t) => toMonthValue(t.date) === selectedMonth
    );

    const previousMonthValue = getPreviousMonthValue(selectedMonth);
    const previousMonthTransactions = transactions.filter(
      (t) => toMonthValue(t.date) === previousMonthValue
    );

    const income = monthTransactions.
    filter((t) => t.type === "INCOME").
    reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthTransactions.
    filter((t) => t.type === "EXPENSE").
    reduce((sum, t) => sum + t.amount, 0);

    const previousIncome = previousMonthTransactions.
    filter((t) => t.type === "INCOME").
    reduce((sum, t) => sum + t.amount, 0);

    const previousExpenses = previousMonthTransactions.
    filter((t) => t.type === "EXPENSE").
    reduce((sum, t) => sum + t.amount, 0);

    const net = income - expenses;
    const previousNet = previousIncome - previousExpenses;

    return {
      totalBalance,
      income,
      expenses,
      trends: {
        income: calculateTrend(income, previousIncome),
        expenses: calculateTrend(expenses, previousExpenses),
        net: calculateTrend(net, previousNet)
      }
    };
  }, [accounts, transactions, selectedMonth]);

  const selectedMonthLabel = formatMonthValue(selectedMonth, locale);

  const cards = [
  {
    label: t("dashboard.totalBalance"),
    value: `₹${stats.totalBalance.toFixed(2)}`,
    icon: Wallet,
    color: "text-orange-500",
    trend: null
  },
  {
    label: `${selectedMonthLabel} ${t("dashboard.incomeLabel")}`,
    value: `₹${stats.income.toFixed(2)}`,
    icon: TrendingUp,
    color: "text-green-500",
    trend: stats.trends.income
  },
  {
    label: `${selectedMonthLabel} ${t("dashboard.expensesLabel")}`,
    value: `₹${stats.expenses.toFixed(2)}`,
    icon: TrendingDown,
    color: "text-red-500",
    trend: stats.trends.expenses
  },
  {
    label: `${selectedMonthLabel} ${t("dashboard.netCashflow")}`,
    value: `₹${(stats.income - stats.expenses).toFixed(2)}`,
    icon: CreditCard,
    color: "text-orange-400",
    trend: stats.trends.net
  }];


  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) =>
      <Card key={card.label}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground truncate">
                  {card.label}
                </p>
                <p className={cn("text-xl md:text-2xl font-bold", card.color)}>
                  {card.value}
                </p>
                {card.trend &&
                <div
                  className={cn(
                    "mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                    card.trend.isNeutral && "bg-muted text-muted-foreground",
                    !card.trend.isNeutral && card.trend.isPositive && "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
                    !card.trend.isNeutral && !card.trend.isPositive && "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                  )}>
                    {card.trend.isNeutral ?
                  <span>{t("dashboard.stableVsLastMonth")}</span> :
                  <>
                        {card.trend.isPositive ?
                    <ArrowUpRight className="h-3.5 w-3.5" /> :
                    <ArrowDownRight className="h-3.5 w-3.5" />
                    }
                        <span>{card.trend.value.toFixed(1)}% {t("dashboard.vsLastMonth")}</span>
                      </>
                  }
                  </div>
                }
              </div>
              <card.icon
              className={cn("h-8 w-8 opacity-40 shrink-0", card.color)} />
            
            </div>
          </CardContent>
        </Card>
      )}
    </div>);

}
