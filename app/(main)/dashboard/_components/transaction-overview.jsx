"use client";

import { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend } from
"recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatDateValue, formatMonthValue, toMonthValue } from "@/lib/month-range";
import { useLanguage } from "@/components/language-provider";
import { getCategoryColor, normalizeCategoryKey } from "@/lib/category-utils";

const COLORS = [
"#FF6B6B",
"#4ECDC4",
"#45B7D1",
"#96CEB4",
"#FFEEAD",
"#D4A5A5",
"#9FA8DA"];


export function DashboardOverview({ accounts, transactions, selectedMonth }) {
  const { t, locale } = useLanguage();
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts.find((a) => a.isDefault)?.id || accounts[0]?.id
  );


  const accountTransactions = transactions.filter(
    (t) => t.accountId === selectedAccountId
  );

  const selectedMonthTransactions = accountTransactions.filter(
    (t) => toMonthValue(t.date) === selectedMonth
  );


  const recentTransactions = selectedMonthTransactions.
  sort((a, b) => new Date(b.date) - new Date(a.date)).
  slice(0, 5);


  const selectedMonthExpenses = selectedMonthTransactions.filter(
    (t) => t.type === "EXPENSE"
  );


  const expensesByCategory = selectedMonthExpenses.reduce((acc, transaction) => {
    const category = normalizeCategoryKey(transaction.category);
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += transaction.amount;
    return acc;
  }, {});


  const pieChartData = Object.entries(expensesByCategory).map(
    ([category, amount]) => ({
      id: category,
      name: t(`categories.${category}`, {}, category),
      value: amount
    })
  );

  const selectedMonthLabel = formatMonthValue(selectedMonth, locale);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base font-normal">
            {t("dashboard.latestActivity")} ({selectedMonthLabel})
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={selectedAccountId}
              onValueChange={setSelectedAccountId}>
              
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t("dashboard.selectAccount")} />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) =>
                <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length === 0 ?
            <div className="text-center py-6">
              <p className="text-muted-foreground">{t("dashboard.noActivity")}</p>
              <p className="text-sm mt-2 font-medium text-primary">
                {t("analytics.storyStart", {}, "Your financial story starts here. Let&apos;s log your first transaction to unlock insights!")}
              </p>
            </div> :

            recentTransactions.map((transaction) =>
            <div
              key={transaction.id}
              className="flex items-center justify-between">
              
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {transaction.description || t("dashboard.untitledTransaction")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDateValue(transaction.date, locale)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                  className={cn(
                    "flex items-center",
                    transaction.type === "EXPENSE" ?
                    "text-red-500" :
                    "text-green-500"
                  )}>
                  
                      {transaction.type === "EXPENSE" ?
                  <ArrowDownRight className="mr-1 h-4 w-4" /> :

                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  }
                      ₹{transaction.amount.toFixed(2)}
                    </div>
                  </div>
                </div>
            )
            }
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-normal">
            {t("dashboard.expenseMix")} ({selectedMonthLabel})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 pb-5">
          {pieChartData.length === 0 ?
          <div className="text-center py-6">
            <p className="text-muted-foreground">{t("dashboard.noExpenseData")}</p>
            <p className="text-sm mt-2 font-medium text-primary">
              {t("analytics.storyStart", {}, "Your financial story starts here. Let&apos;s log your first transaction to unlock insights!")}
            </p>
          </div> :

          <div className="h-[300px]" role="img" aria-label="Pie chart illustrating the breakdown of expenses by category">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ₹${value.toFixed(2)}`}>
                  
                    {pieChartData.map((entry, index) =>
                  <Cell
                    key={`cell-${index}`}
                    fill={getCategoryColor(entry.id, COLORS[index % COLORS.length])} />

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
    </div>);

}
