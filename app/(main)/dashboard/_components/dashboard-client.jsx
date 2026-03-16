"use client";

import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import {
  buildMonthRangeFromTransactions,
  formatMonthValue,
  getCurrentMonthValue,
  toMonthValue } from
"@/lib/month-range";
import { buildDashboardIntelligence } from "@/lib/dashboard-intelligence";
import { DashboardSummary } from "./dashboard-summary";
import { DashboardOverview } from "./transaction-overview";
import { FinancialHero } from "./financial-hero";
import { InsightsForecastPanel } from "./insights-forecast-panel";
import { useLanguage } from "@/components/language-provider";

export default function DashboardClient({ accounts = [], transactions = [] }) {
  const { t, locale } = useLanguage();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());

  const monthOptions = useMemo(
    () => buildMonthRangeFromTransactions(transactions),
    [transactions]
  );

  const monthlyStats = useMemo(() => {
    const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance), 0);
    const monthTransactions = transactions.filter((transaction) => toMonthValue(transaction.date) === selectedMonth);

    const income = monthTransactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expenses = monthTransactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return {
      totalBalance,
      income,
      expenses,
      transactionCount: monthTransactions.length
    };
  }, [accounts, transactions, selectedMonth]);

  const dashboardIntelligence = useMemo(
    () =>
    buildDashboardIntelligence({
      transactions,
      selectedMonth,
      totalBalance: monthlyStats.totalBalance,
      t
    }),
    [transactions, selectedMonth, monthlyStats.totalBalance, t]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border bg-card/70 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{t("dashboard.commandCenter")}</p>
          <h2 className="text-xl font-semibold tracking-tight">{t("dashboard.commandCenterTitle")}</h2>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder={t("dashboard.selectMonth")} />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((monthValue) =>
            <SelectItem key={monthValue} value={monthValue}>
                {formatMonthValue(monthValue, locale)}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <FinancialHero
        selectedMonthLabel={formatMonthValue(selectedMonth, locale)}
        totalBalance={monthlyStats.totalBalance}
        income={monthlyStats.income}
        expenses={monthlyStats.expenses}
        transactionCount={monthlyStats.transactionCount} />

      <InsightsForecastPanel
        selectedMonthLabel={formatMonthValue(selectedMonth, locale)}
        intelligence={dashboardIntelligence} />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight">{t("dashboard.performanceSnapshot")}</h3>
        <p className="text-sm text-muted-foreground">{t("dashboard.performanceHint")}</p>
      </div>

      <DashboardSummary
        accounts={accounts}
        transactions={transactions}
        selectedMonth={selectedMonth} />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight">{t("dashboard.spendingStory")}</h3>
        <p className="text-sm text-muted-foreground">{t("dashboard.spendingHint")}</p>
      </div>

      <DashboardOverview
        accounts={accounts}
        transactions={transactions}
        selectedMonth={selectedMonth} />
      
    </div>);

}
