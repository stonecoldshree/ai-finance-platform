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
import { MonthlyBudgetDialog } from "./monthly-budget-dialog";
import { useLanguage } from "@/components/language-provider";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PiggyBank, Plus } from "lucide-react";

export default function DashboardClient({ accounts = [], transactions = [], budgetStatus = [] }) {
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

  // Filter accounts that need budgets this month
  const accountsNeedingBudget = useMemo(
    () => budgetStatus.filter((a) => !a.hasBudgetThisMonth),
    [budgetStatus]
  );

  // Empty state for new users with no accounts
  if (accounts.length === 0) {
    return (
      <div className="space-y-8">
        <Card className="border-dashed border-2 border-orange-200 dark:border-orange-800">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-6">
            <div className="rounded-full bg-orange-100 dark:bg-orange-950/40 p-6">
              <PiggyBank className="h-12 w-12 text-orange-500" />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold tracking-tight">
                {t("dashboard.welcomeTitle") || "Welcome to Gullak!"}
              </h3>
              <p className="text-muted-foreground max-w-md">
                {t("dashboard.welcomeSubtitle") || "Start by adding your first bank account to track your finances, set budgets, and get insights."}
              </p>
            </div>
            <CreateAccountDrawer>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 gap-2">
                <Plus className="h-5 w-5" />
                {t("dashboard.addFirstAccount") || "Add Your First Account"}
              </Button>
            </CreateAccountDrawer>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Monthly Budget Popup */}
      <MonthlyBudgetDialog accountsNeedingBudget={accountsNeedingBudget} />

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
