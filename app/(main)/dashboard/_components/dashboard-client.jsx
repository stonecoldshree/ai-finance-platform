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

export default function DashboardClient({ accounts, transactions }) {
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
      totalBalance: monthlyStats.totalBalance
    }),
    [transactions, selectedMonth, monthlyStats.totalBalance]
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-2xl border bg-card/70 p-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Financial command center</p>
          <h2 className="text-xl font-semibold tracking-tight">Track momentum, spot risk, and act faster</h2>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[190px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((monthValue) =>
            <SelectItem key={monthValue} value={monthValue}>
                {formatMonthValue(monthValue)}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <FinancialHero
        selectedMonthLabel={formatMonthValue(selectedMonth)}
        totalBalance={monthlyStats.totalBalance}
        income={monthlyStats.income}
        expenses={monthlyStats.expenses}
        transactionCount={monthlyStats.transactionCount} />

      <InsightsForecastPanel
        selectedMonthLabel={formatMonthValue(selectedMonth)}
        intelligence={dashboardIntelligence} />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight">Performance Snapshot</h3>
        <p className="text-sm text-muted-foreground">Month-over-month movement for the numbers that matter most.</p>
      </div>

      <DashboardSummary
        accounts={accounts}
        transactions={transactions}
        selectedMonth={selectedMonth} />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight">Spending Story</h3>
        <p className="text-sm text-muted-foreground">Recent activity and category concentration for the selected month.</p>
      </div>

      <DashboardOverview
        accounts={accounts}
        transactions={transactions}
        selectedMonth={selectedMonth} />
      
    </div>);

}
