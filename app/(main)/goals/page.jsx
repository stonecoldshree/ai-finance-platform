import { getCurrentBudget } from "@/actions/budget";
import { getUserAccounts, getDashboardData } from "@/actions/dashboard";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

export default async function GoalsPage() {
  const [accounts, allTransactions] = await Promise.all([
    getUserAccounts(),
    getDashboardData({ includeAllMonths: true })
  ]);

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
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">Goals</h1>
        <Card className="border-orange-200/60 bg-orange-50/40 dark:border-orange-900/40 dark:bg-orange-950/10">
          <CardContent className="space-y-4 py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Create your first account to unlock savings and budget goals.
            </p>
            <Link href="/transaction/create">
                <Button>Add Your First Transaction</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-5">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">Goals</h1>
      <p className="text-sm text-muted-foreground">
        Student-friendly goals to keep spending in control and build savings for upcoming plans.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Monthly Savings</p>
            <p className="text-2xl font-bold text-green-500">₹{totalSavings.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold text-green-500">₹{totalIncome.toFixed(2)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
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
                <p className="text-muted-foreground">Budget Goal Progress</p>
                <p className="font-medium">
                  ₹{expense.toFixed(2)} spent {budgetAmount > 0 ? `of ₹${budgetAmount.toFixed(2)}` : "(no budget set)"}
                </p>
                <Progress value={usagePct} className="mt-2" />
              </div>

              <div>
                <p className="text-muted-foreground">Savings Goal Progress (This Month)</p>
                <p className="font-medium">
                  ₹{savings.toFixed(2)} saved of suggested ₹{suggestedGoal.toFixed(2)}
                </p>
                <Progress value={progressToGoal} className="mt-2" />
              </div>

              <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
                <p>Income: ₹{income.toFixed(2)}</p>
                <p>Expenses: ₹{expense.toFixed(2)}</p>
                <p>
                  Focus tip: {savings > 0 ? "Keep this momentum and avoid impulse categories this week." : "Reduce top spending category by 10% this week to start savings."}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
