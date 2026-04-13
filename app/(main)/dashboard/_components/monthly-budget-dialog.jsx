"use client";

import { useState, useEffect } from "react";
import { Loader2, PiggyBank, AlertTriangle, Sparkles } from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import { updateBudget } from "@/actions/budget";
import { useLanguage } from "@/components/language-provider";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Monthly budget dialog that appears at the start of each month
 * when the user has accounts without budgets set for the current month.
 */
export function MonthlyBudgetDialog({ accountsNeedingBudget = [] }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [budgetAmounts, setBudgetAmounts] = useState({});
  const [error, setError] = useState("");
  const [showFiftyRule, setShowFiftyRule] = useState(false);

  const {
    loading: saving,
    fn: saveBudgetFn,
    data: saveResult,
    error: saveError
  } = useFetch(updateBudget);

  // Show dialog if there are accounts that need budgets
  useEffect(() => {
    if (accountsNeedingBudget.length > 0) {
      // Check if user already dismissed this month
      const currentMonth = new Date().toISOString().slice(0, 7);
      const dismissedMonth = localStorage.getItem("gullak.budgetDismissed");
      const isOnboarded = localStorage.getItem("gullak.onboarded");
      if (dismissedMonth !== currentMonth && isOnboarded) {
        setOpen(true);
      }
    }
  }, [accountsNeedingBudget]);

  useEffect(() => {
    if (saveResult?.success) {
      const nextIndex = currentIndex + 1;
      if (nextIndex < accountsNeedingBudget.length) {
        setCurrentIndex(nextIndex);
        setError("");
        setShowFiftyRule(false);
      } else {
        // All accounts done
        toast.success(t("budget.allBudgetsSet") || "All monthly budgets have been set! 🎉");
        setOpen(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveResult]);

  useEffect(() => {
    if (saveError) {
      setError(saveError.message || t("budget.failedUpdate") || "Failed to set budget");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saveError]);

  if (accountsNeedingBudget.length === 0) return null;

  const currentAccount = accountsNeedingBudget[currentIndex];
  if (!currentAccount) return null;

  const handleSetBudget = async () => {
    const amount = parseFloat(budgetAmounts[currentAccount.id] || "");
    if (isNaN(amount) || amount <= 0) {
      setError(t("budget.invalidAmount") || "Please enter a valid budget amount");
      return;
    }

    if (amount > currentAccount.balance) {
      setError(
        `Budget cannot exceed your account balance of ₹${currentAccount.balance.toFixed(2)}`
      );
      return;
    }

    setError("");
    setShowFiftyRule(true);
  };

  const handleConfirmWithRule = async () => {
    const amount = parseFloat(budgetAmounts[currentAccount.id]);
    await saveBudgetFn(amount, currentAccount.id);
  };

  const handleDismiss = () => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    localStorage.setItem("gullak.budgetDismissed", currentMonth);
    setOpen(false);
  };

  const effectiveBudget = parseFloat(budgetAmounts[currentAccount.id] || 0) / 2;

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-lg">
            <PiggyBank className="h-5 w-5 text-orange-500" />
            {t("budget.monthlyBudgetSetup") || "Set Monthly Budget"}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {t("budget.newMonthMessage") || "It's a new month! Set your spending budget to stay on track."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Account info */}
        <div className="space-y-4 py-2">
          <div className="rounded-xl border bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10 p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              {accountsNeedingBudget.length > 1
                ? `${t("budget.account") || "Account"} ${currentIndex + 1} ${t("budget.of") || "of"} ${accountsNeedingBudget.length}`
                : t("budget.account") || "Account"
              }
            </p>
            <p className="text-base font-semibold mt-1 capitalize">
              {currentAccount.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("budget.balance") || "Balance"}: ₹{currentAccount.balance.toFixed(2)}
            </p>
          </div>

          {!showFiftyRule ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("budget.monthlyBudget") || "Monthly Budget"} (₹)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t("budget.enterAmount") || "Enter budget amount"}
                  value={budgetAmounts[currentAccount.id] || ""}
                  onChange={(e) => {
                    setBudgetAmounts((prev) => ({
                      ...prev,
                      [currentAccount.id]: e.target.value
                    }));
                    setError("");
                  }}
                  autoFocus
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg p-3">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </>
          ) : (
            /* 50% Rule Info */
            <div className="space-y-3">
              <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20 p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                      {t("budget.fiftyRuleTitle") || "Smart 50/50 Budget Rule"}
                    </p>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                      {t("budget.fiftyRuleDesc") || "Gullak will consider only 50% of your budget for spending. The remaining 50% should be saved or invested for a healthier financial future."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="rounded-lg bg-white/70 dark:bg-background/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      {t("budget.spendingBudget") || "Spending Budget"}
                    </p>
                    <p className="text-lg font-bold text-orange-600">
                      ₹{effectiveBudget.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/70 dark:bg-background/50 p-3 text-center">
                    <p className="text-xs text-muted-foreground">
                      {t("budget.savingsTarget") || "Save / Invest"}
                    </p>
                    <p className="text-lg font-bold text-green-600">
                      ₹{effectiveBudget.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg p-3">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <AlertDialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={handleDismiss} disabled={saving}>
            {t("budget.remindLater") || "Remind Later"}
          </Button>
          {!showFiftyRule ? (
            <Button onClick={handleSetBudget} className="bg-orange-600 hover:bg-orange-700">
              {t("budget.setBudget") || "Set Budget"}
            </Button>
          ) : (
            <Button
              onClick={handleConfirmWithRule}
              disabled={saving}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("budget.saving") || "Saving..."}
                </>
              ) : (
                t("budget.confirmBudget") || "Confirm Budget"
              )}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
