import { getUserGoals } from "@/actions/goals";
import { getDashboardData } from "@/actions/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getLocaleFromCookie } from "@/lib/i18n/server";
import { getTranslator } from "@/lib/i18n/translations";
import { CreateGoalDrawer } from "./_components/create-goal-drawer";
import { GoalCard } from "./_components/goal-card";
import { PiggyBank, Target, Flag } from "lucide-react";

export default async function GoalsPage() {
  const [goals, monthTransactions, locale] = await Promise.all([
    getUserGoals(),
    getDashboardData(),
    getLocaleFromCookie()
  ]);
  const t = getTranslator(locale);

  
  const safeGoals = goals || [];
  const totalLocked = safeGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const activeGoals = safeGoals.filter(g => g.status === "IN_PROGRESS");

  
  let nextGoal = null;
  let maxProgress = -1;
  activeGoals.forEach(g => {
    const progress = (g.currentAmount / g.targetAmount) * 100;
    if (progress > maxProgress) {
      maxProgress = progress;
      nextGoal = g;
    }
  });

  
  const monthIncome = monthTransactions
    .filter(t => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const monthExpense = monthTransactions
    .filter(t => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);
  
  const globalMonthlySavingsRate = Math.max(0, monthIncome - monthExpense);

  return (
    <div className="space-y-6 px-5 mb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title">
            {t("goals.title") || "Goals"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("goals.subtitle") || "Plan your targets, build your savings pots, and achieve your financial dreams."}
          </p>
        </div>
        <CreateGoalDrawer>
          <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
            <Target className="mr-2 h-4 w-4" />
            {t("goals.createGoal") || "Create Goal"}
          </Button>
        </CreateGoalDrawer>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
              <PiggyBank className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("goals.totalLocked") || "Total Money Saved"}</p>
              <p className="text-2xl font-bold text-foreground">₹{totalLocked.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("goals.activeGoals") || "Active Goals"}</p>
              <p className="text-2xl font-bold text-foreground">{activeGoals.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 flex flex-row items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
              <Flag className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t("goals.nextGoalToHit") || "Next Goal to Hit"}</p>
              <p className="text-lg font-bold text-foreground truncate max-w-[150px]">
                {nextGoal ? nextGoal.name : t("common.none", {}, "None")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {safeGoals.length === 0 ? (
        <Card className="border-orange-200/60 bg-orange-50/40 dark:border-orange-900/40 dark:bg-orange-950/10 mt-8">
          <CardContent className="space-y-4 py-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xl font-semibold text-foreground">
              {t("goals.noGoals") || "No active goals."}
            </p>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t("goals.noGoalsSub") || "You haven't set any financial goals yet. What's your next big target? A laptop? A vacation? Let's start tracking!"}
            </p>
            <div className="pt-4">
              <CreateGoalDrawer>
                <Button>{t("goals.createGoal") || "Create Goal"}</Button>
              </CreateGoalDrawer>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {safeGoals.map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              globalMonthlySavingsRate={globalMonthlySavingsRate} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
