"use client";

import { useState, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle } from
"@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateBudget } from "@/actions/budget";
import { useLanguage } from "@/components/language-provider";

export function BudgetProgress({
  initialBudget,
  currentExpenses,
  accountId,
  accountName,
  periodLabel
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    initialBudget?.amount?.toString() || ""
  );
  const { t } = useLanguage();

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error
  } = useFetch(updateBudget);

  const percentUsed = initialBudget ?
  currentExpenses / initialBudget.amount * 100 :
  0;

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error(t("budget.invalidAmount"));
      return;
    }

    await updateBudgetFn(amount, accountId);
  };

  const handleCancel = () => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  useEffect(() => {
    setNewBudget(initialBudget?.amount?.toString() || "");
    setIsEditing(false);
  }, [initialBudget, accountId]);

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success(t("budget.updatedSuccess"));
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || t("budget.failedUpdate"));
    }
  }, [error]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle className="text-sm font-medium">
            {t("budget.monthlyBudget")}{accountName ? ` - ${accountName}` : ""}
            {periodLabel ? ` (${periodLabel})` : ""}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ?
            <div className="flex items-center gap-2">
                <Input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(e.target.value)}
                className="w-32"
                placeholder={t("budget.enterAmount")}
                autoFocus
                disabled={isLoading} />
              
                <Button
                variant="ghost"
                size="icon"
                onClick={handleUpdateBudget}
                disabled={isLoading}>
                
                  <Check className="h-4 w-4 text-green-500" />
                </Button>
                <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                disabled={isLoading}>
                
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div> :

            <>
                <CardDescription>
                  {initialBudget ?
                t("budget.spentOf", { spent: currentExpenses.toFixed(2), total: initialBudget.amount.toFixed(2) }) :
                t("budget.noBudgetSet")}
                </CardDescription>
                <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6">
                
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            }
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {initialBudget &&
        <div className="space-y-2">
            <Progress
            value={percentUsed}
            extraStyles={`${

            percentUsed >= 90 ?
            "bg-red-500" :
            percentUsed >= 75 ?
            "bg-yellow-500" :
            "bg-green-500"}`
            } />
          
            <p className="text-xs text-muted-foreground text-right">
              {t("budget.percentUsed", { pct: percentUsed.toFixed(1) })}
            </p>
          </div>
        }
      </CardContent>
    </Card>);

}
