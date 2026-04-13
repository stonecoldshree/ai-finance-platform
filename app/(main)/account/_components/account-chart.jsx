"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import { useLanguage } from "@/components/language-provider";

const LazyBarChart = dynamic(
  () => import("recharts").then((mod) => {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = mod;
    // Return a wrapper component that renders the chart
    const ChartWrapper = ({ data, incomeLabel, expenseLabel }) => (
      <div role="img" aria-label="Line chart demonstrating income and expenses over the selected date range" style={{ width: "100%", height: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              fontSize={12}
              tickLine={false}
              axisLine={false} />
            <YAxis
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`} />
            <Tooltip
              formatter={(value) => [`₹${value}`, undefined]}
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)"
              }} />
            <Legend />
            <Bar
              dataKey="income"
              name={incomeLabel}
              fill="#22c55e"
              radius={[4, 4, 0, 0]} />
            <Bar
              dataKey="expense"
              name={expenseLabel}
              fill="#ef4444"
              radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
    ChartWrapper.displayName = "ChartWrapper";
    return ChartWrapper;
  }),
  {
    ssr: false,
    loading: () => <div className="h-[300px] bg-muted/30 animate-pulse rounded-lg" />
  }
);

const DATE_RANGE_KEYS = {
  "7D": { days: 7, labelKey: "accountChart.last7Days" },
  "1M": { days: 30, labelKey: "accountChart.lastMonth" },
  "3M": { days: 90, labelKey: "accountChart.last3Months" },
  "6M": { days: 180, labelKey: "accountChart.last6Months" },
  ALL: { days: null, labelKey: "accountChart.allTime" }
};

export function AccountChart({ transactions }) {
  const [dateRange, setDateRange] = useState("1M");
  const { t } = useLanguage();

  const filteredData = useMemo(() => {
    const range = DATE_RANGE_KEYS[dateRange];
    const now = new Date();
    const startDate = range.days ?
    startOfDay(subDays(now, range.days)) :
    startOfDay(new Date(0));

    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );

    const grouped = filtered.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }
      return acc;
    }, {});

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [transactions, dateRange]);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-base font-normal">
          {t("accountChart.transactionOverview")}
        </CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder={t("accountChart.selectRange")} />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGE_KEYS).map(([key, { labelKey }]) =>
            <SelectItem key={key} value={key}>
                {t(labelKey)}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around mb-6 text-sm">
          <div className="text-center">
            <p className="text-muted-foreground">{t("accountChart.totalIncome")}</p>
            <p className="text-lg font-bold text-green-500">
              ₹{totals.income.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">{t("accountChart.totalExpenses")}</p>
            <p className="text-lg font-bold text-red-500">
              ₹{totals.expense.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-muted-foreground">{t("accountChart.net")}</p>
            <p
              className={`text-lg font-bold ${totals.income - totals.expense >= 0 ?
              "text-green-500" :
              "text-red-500"}`
              }>
              ₹{(totals.income - totals.expense).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="h-[300px]">
          <LazyBarChart
            data={filteredData}
            incomeLabel={t("accountChart.income")}
            expenseLabel={t("accountChart.expense")}
          />
        </div>
      </CardContent>
    </Card>);
}
