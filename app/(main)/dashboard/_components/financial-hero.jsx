"use client";

import { AlertTriangle, CheckCircle2, Sparkles, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function FinancialHero({ selectedMonthLabel, totalBalance, income, expenses, transactionCount }) {
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;
  const expenseRatio = income > 0 ? (expenses / income) * 100 : expenses > 0 ? 100 : 0;
  const healthScore = clamp(Math.round(100 - expenseRatio * 0.6 + savingsRate * 0.4), 0, 100);

  const projectedMonthEnd = totalBalance + (income - expenses);
  const netChange = income - expenses;
  const riskLabel =
    healthScore >= 75 ? "On track" : healthScore >= 50 ? "Watch spending" : "Action needed";

  const quickInsights = [
    netChange >= 0
      ? "You are cashflow-positive this month."
      : "You are spending more than you are earning this month.",
    transactionCount >= 40
      ? "High transaction activity detected. Review frequent categories."
      : "Transaction volume is manageable this month.",
    projectedMonthEnd >= totalBalance
      ? "Projected month-end balance is improving."
      : "Projected month-end balance may decline if current pace continues."
  ];

  return (
    <Card className="overflow-hidden border-orange-200/60 bg-gradient-to-br from-orange-50 via-background to-amber-50 dark:border-orange-900/40 dark:from-orange-950/30 dark:via-background dark:to-amber-950/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-orange-500" />
          Financial Pulse - {selectedMonthLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border bg-card/70 p-4">
            <p className="text-sm text-muted-foreground">Financial Health Score</p>
            <p className="mt-1 text-3xl font-bold text-orange-500">{healthScore}/100</p>
            <p className="mt-1 text-sm text-muted-foreground">{riskLabel}</p>
          </div>

          <div className="rounded-xl border bg-card/70 p-4">
            <p className="text-sm text-muted-foreground">Projected Month-End Balance</p>
            <p className="mt-1 text-3xl font-bold text-foreground">₹{projectedMonthEnd.toFixed(2)}</p>
            <p className={`mt-1 text-sm ${netChange >= 0 ? "text-green-600" : "text-red-600"}`}>
              {netChange >= 0 ? "Projected growth" : "Projected decline"}: ₹{Math.abs(netChange).toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl border bg-card/70 p-4">
            <p className="text-sm text-muted-foreground">Current Total Balance</p>
            <p className="mt-1 flex items-center gap-2 text-3xl font-bold text-foreground">
              <Wallet className="h-6 w-6 text-orange-500" />₹{totalBalance.toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Across all linked accounts</p>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-3">
          {quickInsights.map((insight, index) => (
            <div key={index} className="rounded-lg border bg-background/80 p-3 text-sm">
              <p className="flex items-start gap-2">
                {index === 0 && (netChange >= 0 ? <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600" /> : <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600" />)}
                {index === 1 && <Sparkles className="mt-0.5 h-4 w-4 text-orange-500" />}
                {index === 2 && <Wallet className="mt-0.5 h-4 w-4 text-orange-500" />}
                <span>{insight}</span>
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}