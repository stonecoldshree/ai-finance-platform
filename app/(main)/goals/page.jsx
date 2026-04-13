import { getCurrentBudget } from "@/actions/budget";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { getTranslator } from "@/lib/i18n/translations";

function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export default async function GoalsPage() {
  const [accounts, allTransactions, locale] = await Promise.all([
    getUserAccounts(),
    getDashboardData({ includeAllMonths: true }),
    getLocaleFromCookie()
  ]);
  const t = getTranslator(locale);

  const { start, end } = getCurrentMonthRange();
  const monthTransactions = (allTransactions || []).filter((transaction) => {
    const date = new Date(transaction.date);
    return date >= start && date <= end;
  });

  const accountGoalCards = await Promise.all(
    (accounts || []).map(async (account) => {
      const budgetData = await getCurrentBudget(account.id);
      const income = monthTransactions
        .filter((transaction) => transaction.accountId === account.id && transaction.type === "INCOME")
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      const expense = monthTransactions
        .filter((transaction) => transaction.accountId === account.id && transaction.type === "EXPENSE")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

      const budgetAmount = budgetData?.budget?.amount || 0;
      const usagePct = budgetAmount > 0 ? Math.min(100, (expense / budgetAmount) * 100) : 0;
      const savings = Math.max(0, income - expense);
      const suggestedGoal = savings > 0 ? savings * 1.2 : Math.max(1000, Number(account.balance) * 0.1);
      const progressToGoal = suggestedGoal > 0 ? Math.min(100, (savings / suggestedGoal) * 100) : 0;

      return {
        account,
        budgetAmount,
        expense,
        income,
        savings,
        usagePct,
        suggestedGoal,
        progressToGoal
      };
    })
  );

  const totalSavings = accountGoalCards.reduce((sum, item) => sum + item.savings, 0);
  const totalIncome = accountGoalCards.reduce((sum, item) => sum + item.income, 0);
  const totalExpenses = accountGoalCards.reduce((sum, item) => sum + item.expense, 0);

  if (!accounts || accounts.length === 0) {
    return (
      <div className="space-y-6 px-5">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">{t("goals.title")}</h1>
        <Card className="border-orange-200/60 bg-orange-50/40 dark:border-orange-900/40 dark:bg-orange-950/10">
          <CardContent className="space-y-4 py-8 text-center">
            <p className="text-muted-foreground">
              {t("goals.noAccounts")}
            </p>
            <p className="text-sm mt-2 text-primary font-medium mb-4">
              You haven&apos;t set any financial goals yet. What&apos;s your next big target? A laptop? A vacation? Let&apos;s start tracking!
            </p>
            <Link href="/transaction/create">
                <Button>{t("goals.addFirstTransaction")}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-5">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">{t("goals.title")}</h1>
      <p className="text-sm text-muted-foreground">
        {t("goals.subtitle")}
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("goals.totalMonthlySavings")}</p>
            <p className="text-2xl font-bold text-green-500">₹{totalSavings.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("goals.totalIncome")}</p>
            <p className="text-2xl font-bold text-green-500">₹{totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">{t("goals.totalExpenses")}</p>
            <p className="text-2xl font-bold text-red-500">₹{totalExpenses.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {accountGoalCards.map(({ account, budgetAmount, expense, income, savings, usagePct, suggestedGoal, progressToGoal }) => (
          <Card key={account.id} className="border-orange-100/70 bg-card/80">
            <CardHeader>
              <CardTitle className="text-lg">{account.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t("goals.budgetGoalProgress")}</p>
                <p className="font-medium">
                  ₹{expense.toFixed(2)} {t("goals.spent")} {budgetAmount > 0 ? t("goals.ofBudget", { amount: budgetAmount.toFixed(2) }) : t("goals.noBudgetSet")}
                </p>
                <Progress value={usagePct} className="mt-2" />
              </div>

              <div>
                <p className="text-muted-foreground">{t("goals.savingsGoalProgress")}</p>
                <p className="font-medium">
                  {t("goals.savedOfSuggested", { savings: savings.toFixed(2), goal: suggestedGoal.toFixed(2) })}
                </p>
                <Progress value={progressToGoal} className="mt-2" />
              </div>

              <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                <p>{t("goals.incomeLabel")} ₹{income.toFixed(2)}</p>
                <p>{t("goals.expensesLabel")} ₹{expense.toFixed(2)}</p>
                <p>
                  {t("goals.focusTip")} {savings > 0 ? t("goals.focusTipMomentum") : t("goals.focusTipReduce")}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
