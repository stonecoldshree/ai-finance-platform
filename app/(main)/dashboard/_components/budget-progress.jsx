"use client";

import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle } from
"@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/components/language-provider";

export function BudgetProgress({
  initialBudget,
  currentExpenses,
  accountName,
  accountBalance = 0,
  periodLabel
}) {
  const { t } = useLanguage();

  const totalBudget = initialBudget?.amount || 0;
  const savingsTarget = accountBalance > 0 ? Math.max(0, accountBalance - totalBudget) : 0;

  // Keep UI budget totals consistent across dashboard/settings using full monthly budget.
  const percentUsed = totalBudget > 0
    ? (currentExpenses / totalBudget) * 100
    : 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">
            {t("budget.monthlyBudget")}{accountName ? ` - ${accountName}` : ""}
            {periodLabel ? ` (${periodLabel})` : ""}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <CardDescription>
              {initialBudget ?
                t("budget.spentOf", {
                  spent: currentExpenses.toFixed(2),
                  total: totalBudget.toFixed(2)
                }) :
                t("budget.noBudgetSet")}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget &&
          <div className="space-y-3">
            {/* Spending progress bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{t("budget.monthlyBudget") || "Monthly Budget"}</span>
                <span>₹{totalBudget.toFixed(2)}</span>
              </div>
              <Progress
                value={Math.min(percentUsed, 100)}
                extraStyles={`${
                  percentUsed >= 90
                    ? "bg-red-500"
                    : percentUsed >= 75
                      ? "bg-yellow-500"
                      : "bg-green-500"
                }`} />
              <p className="text-xs text-muted-foreground text-right">
                {t("budget.percentUsed", { pct: percentUsed.toFixed(1) })}
              </p>
            </div>

            {/* 50% Rule Info Strip */}
            <div className="flex items-center gap-2 rounded-lg bg-orange-50/70 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/40 px-3 py-2">
              <Sparkles className="h-3.5 w-3.5 text-orange-500 shrink-0" />
              <p className="text-xs text-orange-700 dark:text-orange-300">
                {t("budget.fiftyRuleStrip", { amount: savingsTarget.toFixed(2) }, `₹${savingsTarget.toFixed(2)} reserved for savings/investment (50% rule)`)}
              </p>
            </div>

            {percentUsed > 100 && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 px-3 py-2">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  ⚠️ {t("budget.overBudget") || "You've exceeded your spending budget! Consider reducing expenses."}
                </p>
              </div>
            )}
          </div>
        }
      </CardContent>
    </Card>);

}
