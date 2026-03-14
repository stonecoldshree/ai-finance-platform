"use client";

import { AlertTriangle, CheckCircle2, Info, LineChart, ShieldAlert, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function formatCurrency(value) {
  return `₹${value.toFixed(2)}`;
}

function getInsightIcon(type) {
  if (type === "warning") return ShieldAlert;
  if (type === "success") return CheckCircle2;
  return Info;
}

export function InsightsForecastPanel({ selectedMonthLabel, intelligence }) {
  const progressPct = Math.min(100, intelligence.monthProgress * 100);

  const forecastCards = [
  {
    label: "Projected Income",
    value: formatCurrency(intelligence.projectedIncome),
    icon: TrendingUp,
    tone: "text-green-600"
  },
  {
    label: "Projected Expenses",
    value: formatCurrency(intelligence.projectedExpenses),
    icon: AlertTriangle,
    tone: "text-red-600"
  },
  {
    label: "Projected Net",
    value: formatCurrency(intelligence.projectedNet),
    icon: LineChart,
    tone: intelligence.projectedNet >= 0 ? "text-green-600" : "text-red-600"
  },
  {
    label: "Projected Balance",
    value: formatCurrency(intelligence.projectedBalance),
    icon: Wallet,
    tone: "text-orange-600"
  }];


  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <Card className="lg:col-span-3 border-orange-200/60 dark:border-orange-900/40">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <LineChart className="h-4 w-4 text-orange-500" />
            Forecast Strip - {selectedMonthLabel}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {forecastCards.map((card) =>
            <div key={card.label} className="rounded-lg border bg-card/70 p-3">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">{card.label}</p>
                <p className={cn("mt-1 flex items-center gap-2 text-xl font-semibold", card.tone)}>
                  <card.icon className="h-4 w-4" />
                  {card.value}
                </p>
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-orange-50/70 p-3 dark:bg-orange-950/20">
            <p className="text-sm font-medium">Month progress: {progressPct.toFixed(0)}%</p>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-orange-100 dark:bg-orange-950/40">
              <div className="h-full rounded-full bg-orange-500" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Forecast values are pace-adjusted for the current month and final for closed months.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Sparkles className="h-4 w-4 text-orange-500" />
            Rule-Based Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {intelligence.insights.map((insight, index) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <div
                key={`${insight.title}-${index}`}
                className={cn(
                  "rounded-lg border p-3",
                  insight.type === "warning" && "border-red-200 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20",
                  insight.type === "success" && "border-green-200 bg-green-50/50 dark:border-green-900/40 dark:bg-green-950/20",
                  insight.type === "info" && "border-blue-200 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20"
                )}>

                <p className="flex items-start gap-2 text-sm font-medium">
                  <Icon className="mt-0.5 h-4 w-4" />
                  {insight.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">{insight.detail}</p>
              </div>);

          })}
        </CardContent>
      </Card>
    </div>);

}