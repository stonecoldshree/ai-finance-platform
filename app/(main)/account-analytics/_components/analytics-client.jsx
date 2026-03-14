"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid } from
"recharts";
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

const COLORS = [
"#FF6B6B",
"#4ECDC4",
"#45B7D1",
"#96CEB4",
"#FFEEAD",
"#D4A5A5",
"#9FA8DA"];


export default function AccountAnalyticsClient({ accounts, transactions, budgetsByAccount = {} }) {
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

  const periodLabel = formatMonthValue(selectedMonth);

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

    const grouped = monthExpenses.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

    return Object.entries(grouped).
    map(([name, value]) => ({ name, value })).
    sort((a, b) => b.value - a.value);
  }, [accountTransactions, analysisMonth, analysisYear]);

  const previousCategoryTotals = useMemo(() => {
    const previousExpenses = accountTransactions.filter(
      (t) => t.type === "EXPENSE" && isInPreviousMonth(t.date)
    );

    return previousExpenses.reduce((totals, transaction) => {
      totals[transaction.category] = (totals[transaction.category] || 0) + transaction.amount;
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
            <SelectValue placeholder="Select account" />
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
        {selectedAccount &&
        <span className="text-sm text-muted-foreground">
            Balance: ₹{parseFloat(selectedAccount.balance).toFixed(2)}
          </span>
        }
      </div>

      {}
      <BudgetProgress
        initialBudget={budgetsByAccount[selectedAccountId]?.budget}
        currentExpenses={selectedMonthExpenses}
        accountId={selectedAccountId}
        accountName={selectedAccount?.name}
        periodLabel={periodLabel} />
      

      {}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{periodLabel} Income</p>
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
                  {periodLabel} Expenses
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
                <p className="text-sm text-muted-foreground">{periodLabel} Net</p>
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
                <p className="text-sm text-muted-foreground">{periodLabel} Transactions</p>
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
            <p className="text-sm text-muted-foreground">Average Daily Expense</p>
            <p className="mt-1 text-2xl font-bold text-red-500">
              ₹{analyticsInsights.averageDailyExpense.toFixed(2)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Based on active spending days in {periodLabel}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Peak Spending Day</p>
            <p className="mt-1 text-2xl font-bold text-orange-500">
              {analyticsInsights.peakExpenseDay ?
              analyticsInsights.peakExpenseDay.date :
              "N/A"
              }
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {analyticsInsights.peakExpenseDay ?
              `₹${analyticsInsights.peakExpenseDay.expense.toFixed(2)} spent` :
              "No expense data yet"
              }
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Savings Rate</p>
            <p
              className={cn(
                "mt-1 text-2xl font-bold",
                analyticsInsights.savingsRate >= 20 ? "text-green-500" : "text-orange-500"
              )}>

              {analyticsInsights.savingsRate.toFixed(1)}%
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Income retained after monthly spending</p>
          </CardContent>
        </Card>
      </div>

      {analyticsInsights.topCategory &&
      <Card className="border-orange-200/60 bg-orange-50/40 dark:border-orange-900/40 dark:bg-orange-950/10">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Insight of the month</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {analyticsInsights.topCategory.name} contributes {analyticsInsights.topCategoryShare.toFixed(1)}% of your monthly expense total.
              {analyticsInsights.topCategoryShare >= 35 ?
              " This category is highly concentrated, so optimizing it can quickly improve net cashflow." :
              " Your category distribution is fairly balanced this month."
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
              Daily Income vs Expenses ({periodLabel})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {dailyData.length === 0 ?
            <p className="text-center text-muted-foreground py-8">
                No transactions for this period
              </p> :

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" fontSize={12} tickLine={false} />
                    <YAxis
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(v) => `₹${v}`} />
                  
                    <Tooltip
                    formatter={(value) => `₹${value.toFixed(2)}`}
                    contentStyle={{
                      backgroundColor: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)"
                    }} />
                  
                    <Legend />
                    <Bar
                    dataKey="income"
                    name="Income"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]} />
                  
                    <Bar
                    dataKey="expense"
                    name="Expense"
                    fill="#ef4444"
                    radius={[4, 4, 0, 0]} />
                  
                  </BarChart>
                </ResponsiveContainer>
              </div>
            }
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal">
              Expenses by Category ({periodLabel})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 pb-5">
            {categoryData.length === 0 ?
            <p className="text-center text-muted-foreground py-8">
                No expenses for this period
              </p> :

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) =>
                    `${name}: ₹${value.toFixed(2)}`
                    }>
                    
                      {categoryData.map((_, index) =>
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]} />

                    )}
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
            }
          </CardContent>
        </Card>
      </div>

      {}
      {categoryData.length > 0 &&
      <Card>
          <CardHeader>
            <CardTitle className="text-base font-normal">
              Top Spending Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryData.slice(0, 5).map((cat, i) => {
              const total = categoryData.reduce((s, c) => s + c.value, 0);
              const pct = (cat.value / total * 100).toFixed(1);
              const previousValue = previousCategoryTotals[cat.name] || 0;
              const delta = cat.value - previousValue;
              const deltaPct = previousValue > 0 ? delta / previousValue * 100 : delta > 0 ? 100 : 0;
              const trendState = Math.abs(delta) < 0.01 ? "stable" : delta > 0 ? "up" : "down";
              return (
                <div key={cat.name} className="flex items-center gap-3">
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
                            <span className="text-red-500">+{deltaPct.toFixed(1)}% vs previous month</span>
                          </>
                        }
                        {trendState === "down" &&
                        <>
                            <ArrowDownRight className="h-3.5 w-3.5 text-green-500" />
                            <span className="text-green-500">{deltaPct.toFixed(1)}% vs previous month</span>
                          </>
                        }
                        {trendState === "stable" &&
                        <>
                            <Minus className="h-3.5 w-3.5" />
                            <span>Stable vs previous month</span>
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
