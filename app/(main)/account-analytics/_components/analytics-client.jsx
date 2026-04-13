"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { format } from "date-fns";
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Wallet,
  Minus } from
"lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { BudgetProgress } from "../../dashboard/_components/budget-progress";
import {
  buildMonthRangeFromTransactions,
  formatMonthValue,
  getCurrentMonthValue } from
"@/lib/month-range";
import { useLanguage } from "@/components/language-provider";
import { normalizeCategoryKey } from "@/lib/category-utils";

const ChartPlaceholder = () => (
  <div className="h-[300px] bg-muted/30 animate-pulse rounded-lg" />
);

const LazyBarChartSection = dynamic(
  () => import("recharts").then((mod) => {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = mod;
    const Component = ({ data, incomeLabel, expenseLabel }) => (
      <div className="h-[300px]" role="img" aria-label="Bar chart comparing daily income and expenses">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" fontSize={12} tickLine={false} />
            <YAxis fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v}`} />
            <Tooltip
              formatter={(value) => `₹${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }} />
            <Legend />
            <Bar dataKey="income" name={incomeLabel} fill="#22c55e" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name={expenseLabel} fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
    Component.displayName = "LazyBarChartSection";
    return Component;
  }),
  { ssr: false, loading: ChartPlaceholder }
);

const LazyPieChartSection = dynamic(
  () => import("recharts").then((mod) => {
    const { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } = mod;
    const Component = ({ data, colors }) => (
      <div className="h-[300px]" role="img" aria-label="Pie chart showcasing expense distribution by category">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}>
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
    Component.displayName = "LazyPieChartSection";
    return Component;
  }),
  { ssr: false, loading: ChartPlaceholder }
);



const COLORS = [
"#FF6B6B",
"#4ECDC4",
"#45B7D1",
"#96CEB4",
"#FFEEAD",
"#D4A5A5",
"#9FA8DA"];


export default function AccountAnalyticsClient({ accounts, transactions, budgetsByAccount = {} }) {
  const { locale, t } = useLanguage();
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue());

  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  const monthOptions = useMemo(
    () => buildMonthRangeFromTransactions(accountTransactions),
    [accountTransactions]
  );

  useEffect(() => {
    if (!monthOptions.includes(selectedMonth)) {
      setSelectedMonth(monthOptions[0]);
    }
  }, [monthOptions, selectedMonth]);

  const [analysisYear, analysisMonth] = selectedMonth.
  split("-").
  map(Number);

  const previousMonthDate = new Date(analysisYear, analysisMonth - 1, 1);
  previousMonthDate.setMonth(previousMonthDate.getMonth() - 1);
  const previousYear = previousMonthDate.getFullYear();
  const previousMonth = previousMonthDate.getMonth() + 1;

  const periodLabel = formatMonthValue(selectedMonth, locale);

  const isInAnalysisMonth = (dateValue) => {
    const date = new Date(dateValue);
    return (
      date.getMonth() + 1 === analysisMonth &&
      date.getFullYear() === analysisYear);

  };

  const isInPreviousMonth = (dateValue) => {
    const date = new Date(dateValue);
    return (
      date.getMonth() + 1 === previousMonth &&
      date.getFullYear() === previousYear);

  };


  const monthStats = useMemo(() => {
    const monthTxns = accountTransactions.filter((t) => isInAnalysisMonth(t.date));

    const income = monthTxns.
    filter((t) => t.type === "INCOME").
    reduce((sum, t) => sum + t.amount, 0);
    const expense = monthTxns.
    filter((t) => t.type === "EXPENSE").
    reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, net: income - expense, count: monthTxns.length };
  }, [accountTransactions, analysisMonth, analysisYear]);

  const selectedMonthExpenses = useMemo(
    () => monthStats.expense,
    [monthStats.expense]
  );


  const categoryData = useMemo(() => {
    const monthExpenses = accountTransactions.filter(
      (t) => t.type === "EXPENSE" && isInAnalysisMonth(t.date)
    );

    const grouped = monthExpenses.reduce((acc, transaction) => {
      const categoryKey = normalizeCategoryKey(transaction.category);
      acc[categoryKey] = (acc[categoryKey] || 0) + transaction.amount;
      return acc;
    }, {});

    return Object.entries(grouped).
    map(([name, value]) => ({ id: name, name: t(`categories.${name}`, {}, name), value })).
    sort((a, b) => b.value - a.value);
  }, [accountTransactions, analysisMonth, analysisYear]);

  const previousCategoryTotals = useMemo(() => {
    const previousExpenses = accountTransactions.filter(
      (t) => t.type === "EXPENSE" && isInPreviousMonth(t.date)
    );

    return previousExpenses.reduce((totals, transaction) => {
      const categoryKey = normalizeCategoryKey(transaction.category);
      totals[categoryKey] = (totals[categoryKey] || 0) + transaction.amount;
      return totals;
    }, {});
  }, [accountTransactions, previousMonth, previousYear]);


  const dailyData = useMemo(() => {
    const monthTxns = accountTransactions.filter((t) => isInAnalysisMonth(t.date));

    const grouped = monthTxns.reduce((acc, t) => {
      const dateObj = new Date(t.date);
      const dateKey = format(dateObj, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: format(dateObj, "MMM dd"),
          dateKey,
          income: 0,
          expense: 0
        };
      }

      if (t.type === "INCOME") acc[dateKey].income += t.amount;else
      acc[dateKey].expense += t.amount;
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.dateKey) - new Date(b.dateKey)
    );
  }, [accountTransactions, analysisMonth, analysisYear]);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  const selectedMonthBudget = useMemo(() => {
    const accountBudgetMap = budgetsByAccount[selectedAccountId] || {};
    const amount = accountBudgetMap[selectedMonth] ?? accountBudgetMap.__legacy__ ?? 0;
    return amount > 0 ? { amount } : null;
  }, [budgetsByAccount, selectedAccountId, selectedMonth]);

  const analyticsInsights = useMemo(() => {
    const expenseDays = dailyData.filter((day) => day.expense > 0);
    const averageDailyExpense =
      expenseDays.length > 0 ?
      expenseDays.reduce((sum, day) => sum + day.expense, 0) / expenseDays.length :
      0;

    const peakExpenseDay =
      expenseDays.length > 0 ?
      expenseDays.reduce((peak, day) => day.expense > peak.expense ? day : peak, expenseDays[0]) :
      null;

    const savingsRate =
      monthStats.income > 0 ?
      ((monthStats.income - monthStats.expense) / monthStats.income) * 100 :
      0;

    const topCategory = categoryData[0];
    const topCategoryShare =
      monthStats.expense > 0 && topCategory ?
      topCategory.value / monthStats.expense * 100 :
      0;

    return {
      averageDailyExpense,
      peakExpenseDay,
      savingsRate,
      topCategory,
      topCategoryShare
    };
  }, [dailyData, monthStats.income, monthStats.expense, categoryData]);

  return (
    <div className="space-y-6">
      {}
      <div className="flex items-center gap-4">
        <Select
          value={selectedAccountId}
          onValueChange={setSelectedAccountId}>
          
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("analytics.selectAccount")} />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) =>
            <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder={t("analytics.selectMonth")} />
          </SelectTrigger>
          <SelectContent>
            {monthOptions.map((monthValue) =>
            <SelectItem key={monthValue} value={monthValue}>
                {formatMonthValue(monthValue, locale)}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {selectedAccount &&
        <span className="text-sm text-muted-foreground">
            {t("analytics.balance")} ₹{parseFloat(selectedAccount.balance).toFixed(2)}
          </span>
        }
      </div>

      {}
      <BudgetProgress
        initialBudget={selectedMonthBudget}
        currentExpenses={selectedMonthExpenses}
        accountId={selectedAccountId}
        accountName={selectedAccount?.name}
        accountBalance={selectedAccount ? parseFloat(selectedAccount.balance) : 0}
        periodLabel={periodLabel} />
      

      {}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{periodLabel} {t("analytics.income")}</p>
                <p className="text-2xl font-bold text-green-500">
                  ₹{monthStats.income.toFixed(2)}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {periodLabel} {t("analytics.expenses")}
                </p>
                <p className="text-2xl font-bold text-red-500">
                  ₹{monthStats.expense.toFixed(2)}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{periodLabel} {t("analytics.net")}</p>
                <p
                  className={cn(
                    "text-2xl font-bold",
                    monthStats.net >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                  
                  ₹{monthStats.net.toFixed(2)}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{periodLabel} {t("analytics.transactions")}</p>
                <p className="text-2xl font-bold">{monthStats.count}</p>
              </div>
              <ArrowUpRight className="h-8 w-8 text-orange-500 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("analytics.averageDailyExpense")}</p>
            <p className="mt-1 text-2xl font-bold text-red-500">
              ₹{analyticsInsights.averageDailyExpense.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t("analytics.basedOnActiveDays", { period: periodLabel })}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("analytics.peakSpendingDay")}</p>
            <p className="mt-1 text-2xl font-bold text-orange-500">
              {analyticsInsights.peakExpenseDay ?
              analyticsInsights.peakExpenseDay.date :
              t("analytics.notAvailable")
              }
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {analyticsInsights.peakExpenseDay ?
              `₹${analyticsInsights.peakExpenseDay.expense.toFixed(2)} ${t("analytics.spent")}` :
              t("analytics.noExpenseData")
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("analytics.savingsRate")}</p>
            <p
              className={cn(
                "mt-1 text-2xl font-bold",
                analyticsInsights.savingsRate >= 20 ? "text-green-500" : "text-orange-500"
              )}>

              {analyticsInsights.savingsRate.toFixed(1)}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{t("analytics.incomeRetained")}</p>
          </CardContent>
        </Card>
      </div>

      {analyticsInsights.topCategory &&
      <Card className="border-orange-200/60 bg-orange-50/40 dark:border-orange-900/40 dark:bg-orange-950/10">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-orange-700 dark:text-orange-300">{t("analytics.insightOfMonth")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {analyticsInsights.topCategory.name} {t("analytics.contributes", { pct: analyticsInsights.topCategoryShare.toFixed(1) })}
              {analyticsInsights.topCategoryShare >= 35 ?
              t("analytics.highConcentration") :
              t("analytics.balanced")
              }
            </p>
          </CardContent>
        </Card>
      }

      {}
      <div className="grid gap-4 md:grid-cols-2">
        {}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal">
              {t("analytics.dailyIncomeVsExpenses", { period: periodLabel })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyData.length === 0 ?
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("analytics.noTransactionsPeriod")}</p>
              <p className="text-sm mt-2 text-primary font-medium">
                {t("analytics.storyStart", {}, "Your financial story starts here. Log your first expense or income to unlock AI-driven insights!")}
              </p>
            </div> :

            <LazyBarChartSection
                data={dailyData}
                incomeLabel={t("analytics.incomeBar")}
                expenseLabel={t("analytics.expenseBar")}
              />
            }
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal">
              {t("analytics.expensesByCategory", { period: periodLabel })}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-5">
            {categoryData.length === 0 ?
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("analytics.noExpensesPeriod")}</p>
              <p className="text-sm mt-2 text-primary font-medium">
                {t("analytics.storyStart", {}, "Your financial story starts here. Log your first expense or income to unlock AI-driven insights!")}
              </p>
            </div> :

            <LazyPieChartSection
                data={categoryData}
                colors={COLORS}
              />
            }
          </CardContent>
        </Card>
      </div>

      {}
      {categoryData.length > 0 &&
      <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal">
              {t("analytics.topSpendingCategories")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryData.slice(0, 5).map((cat, i) => {
              const total = categoryData.reduce((s, c) => s + c.value, 0);
              const pct = (cat.value / total * 100).toFixed(1);
              const previousValue = previousCategoryTotals[cat.id] || 0;
              const delta = cat.value - previousValue;
              const deltaPct = previousValue > 0 ? delta / previousValue * 100 : delta > 0 ? 100 : 0;
              const trendState = Math.abs(delta) < 0.01 ? "stable" : delta > 0 ? "up" : "down";
              return (
                <div key={cat.id} className="flex items-center gap-3">
                    <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  
                    <div className="flex-1">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize font-medium">
                          {cat.name}
                        </span>
                        <span className="text-muted-foreground">
                          ₹{cat.value.toFixed(2)} ({pct}%)
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                        {trendState === "up" &&
                        <>
                            <ArrowUpRight className="h-3.5 w-3.5 text-red-500" />
                            <span className="text-red-500">+{deltaPct.toFixed(1)}% {t("analytics.vsPreviousMonth")}</span>
                          </>
                        }
                        {trendState === "down" &&
                        <>
                            <ArrowDownRight className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-green-500">{deltaPct.toFixed(1)}% {t("analytics.vsPreviousMonth")}</span>
                          </>
                        }
                        {trendState === "stable" &&
                        <>
                            <Minus className="h-3.5 w-3.5" />
                            <span>{t("analytics.stablePreviousMonth")}</span>
                          </>
                        }
                      </div>
                      <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pct}%`,
                          backgroundColor: COLORS[i % COLORS.length]
                        }} />
                      
                      </div>
                    </div>
                  </div>);

            })}
            </div>
          </CardContent>
        </Card>
      }
    </div>);

}
