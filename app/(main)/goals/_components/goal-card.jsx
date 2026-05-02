"use client";

import { useState } from "react";
import { format, addMonths } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { Trash2, TrendingUp, Sparkles, PlusCircle } from "lucide-react";
import { deleteGoal } from "@/actions/goals";
import { toast } from "sonner";
import { AddFundsDialog } from "./add-funds-dialog";

export function GoalCard({ goal, globalMonthlySavingsRate = 0 }) {
  const { t } = useLanguage();
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const progressPercentage = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  const isAchieved = goal.status === "ACHIEVED" || progressPercentage >= 100;

  
  let pacingText = null;
  if (!isAchieved) {
    if (globalMonthlySavingsRate > 0) {
      const remainingAmount = goal.targetAmount - goal.currentAmount;
      const monthsToComplete = remainingAmount / globalMonthlySavingsRate;
      
      const estimatedDate = addMonths(new Date(), monthsToComplete);
      pacingText = t("goals.pacingProjection", { date: format(estimatedDate, "MMM yyyy") });
    } else {
      pacingText = t("goals.pacingBoost");
    }
  }

  const handleDelete = async () => {
    if (!confirm(t("goals.confirmDelete"))) return;
    setIsDeleting(true);
    const res = await deleteGoal(goal.id);
    setIsDeleting(false);
    if (res.success) {
      toast.success(t("goals.deletedSuccess") || "Goal deleted successfully.");
    } else {
      toast.error(t("goals.failedAction") || "Failed to delete goal.");
    }
  };

  return (
    <>
      <Card className="flex flex-col relative overflow-hidden group border-orange-100/50 dark:border-orange-900/30">
        <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: goal.color }} />
        
        <CardHeader className="pb-3 flex flex-row items-start justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-white" 
                style={{ backgroundColor: goal.color }}
              >
                <TrendingUp className="w-4 h-4" />
              </div>
              {goal.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {t("goals.targetLabel", { amount: goal.targetAmount.toFixed(2) })}
              {goal.targetDate && ` • ${t("goals.targetByDate", { date: format(new Date(goal.targetDate), "MMM dd, yyyy") })}`}
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col justify-end space-y-4">
          <div className="space-y-1 mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium text-foreground">
                {t("goals.savedAmount", { amount: goal.currentAmount.toFixed(2) })}
              </span>
              <span className="text-muted-foreground">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={progressPercentage} 
              extraStyles={isAchieved ? "bg-green-500" : undefined}
            />
          </div>

          <div className="rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
            {!isAchieved ? (
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                <p>{pacingText}</p>
              </div>
            ) : (
              <p className="text-green-600 dark:text-green-400 font-medium">
                {t("goals.goalAchieved")}
              </p>
            )}
          </div>

          {!isAchieved && (
            <Button 
              className="w-full mt-2" 
              variant="outline"
              onClick={() => setShowAddFunds(true)}
              style={{ borderColor: goal.color, color: goal.color }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {t("goals.addFunds")}
            </Button>
          )}
        </CardContent>
      </Card>

      <AddFundsDialog 
        goal={goal} 
        open={showAddFunds} 
        onOpenChange={setShowAddFunds} 
      />
    </>
  );
}
