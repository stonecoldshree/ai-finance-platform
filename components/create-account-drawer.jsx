"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles, AlertTriangle, PiggyBank } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose } from
"@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { updateBudget } from "@/actions/budget";
import { accountSchema } from "@/app/lib/schema";
import { useLanguage } from "@/components/language-provider";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("account"); // "account" | "budget"
  const [newAccountData, setNewAccountData] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [showFiftyRule, setShowFiftyRule] = useState(false);
  const { t } = useLanguage();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false
    }
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount
  } = useFetch(createAccount);

  const {
    loading: budgetLoading,
    fn: saveBudgetFn,
    data: budgetResult,
    error: budgetSaveError
  } = useFetch(updateBudget);

  const onSubmit = async (data) => {
    await createAccountFn(data);
  };

  // When account is created successfully, move to budget step
  useEffect(() => {
    if (newAccount?.success && newAccount?.data) {
      toast.success(t("createAccountDrawer.createdSuccess"));
      setNewAccountData(newAccount.data);
      setStep("budget");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newAccount]);

  // When budget is saved, close drawer
  useEffect(() => {
    if (budgetResult?.success) {
      toast.success(t("budget.updatedSuccess") || "Budget set successfully!");
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetResult]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || t("createAccountDrawer.failedCreate"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (budgetSaveError) {
      setBudgetError(budgetSaveError.message || t("budget.failedUpdate"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [budgetSaveError]);

  const handleClose = () => {
    reset();
    setStep("account");
    setNewAccountData(null);
    setBudgetAmount("");
    setBudgetError("");
    setShowFiftyRule(false);
    setOpen(false);
  };

  const handleSetBudget = () => {
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      setBudgetError(t("budget.invalidAmount") || "Please enter a valid budget amount");
      return;
    }

    const balance = parseFloat(newAccountData.balance);
    if (amount > balance * 0.5) {
      setBudgetError(
        t("budgetValidation.exceedsFiftyPercent", { maxAmount: (balance * 0.5).toFixed(2) })
      );
      return;
    }

    setBudgetError("");
    setShowFiftyRule(true);
  };

  const handleConfirmBudget = async () => {
    const amount = parseFloat(budgetAmount);
    await saveBudgetFn(amount, newAccountData.id);
  };

  const handleSkipBudget = () => {
    handleClose();
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else setOpen(true);
    }}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            {step === "account"
              ? t("createAccountDrawer.title")
              : (
                <span className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5 text-orange-500" />
                  {t("budget.setBudgetForAccount") || "Set Budget"}
                </span>
              )
            }
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          {step === "account" ? (
            /* Step 1: Create Account */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">

                  {t("createAccountDrawer.accountName")}
                </label>
                <Input
                  id="name"
                  placeholder={t("createAccountDrawer.namePlaceholder")}
                  {...register("name")} />

                {errors.name &&
                <p className="text-sm text-red-500">{errors.name.message}</p>
                }
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="type"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">

                  {t("createAccountDrawer.accountType")}
                </label>
                <Select
                  onValueChange={(value) => setValue("type", value)}
                  defaultValue={watch("type")}>

                  <SelectTrigger id="type">
                    <SelectValue placeholder={t("createAccountDrawer.selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CURRENT">{t("createAccountDrawer.current")}</SelectItem>
                    <SelectItem value="SAVINGS">{t("createAccountDrawer.savings")}</SelectItem>
                  </SelectContent>
                </Select>
                {errors.type &&
                <p className="text-sm text-red-500">{errors.type.message}</p>
                }
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="balance"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">

                  {t("createAccountDrawer.initialBalance")}
                </label>
                <Input
                  id="balance"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...register("balance")} />

                {errors.balance &&
                <p className="text-sm text-red-500">{errors.balance.message}</p>
                }
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <label
                    htmlFor="isDefault"
                    className="text-base font-medium cursor-pointer">

                    {t("createAccountDrawer.setDefault")}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {t("createAccountDrawer.setDefaultDesc")}
                  </p>
                </div>
                <Switch
                  id="isDefault"
                  checked={watch("isDefault")}
                  onCheckedChange={(checked) => setValue("isDefault", checked)} />

              </div>

              <div className="flex gap-4 pt-4">
                <DrawerClose asChild>
                  <Button type="button" variant="outline" className="flex-1">
                    {t("createAccountDrawer.cancel")}
                  </Button>
                </DrawerClose>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={createAccountLoading}>

                  {createAccountLoading ?
                  <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("createAccountDrawer.creating")}
                    </> :

                  t("createAccountDrawer.createAccount")
                  }
                </Button>
              </div>
            </form>
          ) : (
            /* Step 2: Set Budget for New Account */
            <div className="space-y-4">
              {/* Account info card */}
              <div className="rounded-xl border bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10 p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {t("budget.newAccountCreated") || "Account Created Successfully!"}
                </p>
                <p className="text-base font-semibold mt-1 capitalize">
                  {newAccountData?.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t("budget.balance") || "Balance"}: ₹{parseFloat(newAccountData?.balance || 0).toFixed(2)}
                </p>
              </div>

              <p className="text-sm text-muted-foreground">
                {t("budget.setMonthlyBudgetDesc") || "Set a monthly spending budget for this account to keep your finances on track."}
              </p>

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
                      value={budgetAmount}
                      onChange={(e) => {
                        setBudgetAmount(e.target.value);
                        setBudgetError("");
                      }}
                      autoFocus
                    />
                  </div>

                  {budgetError && (
                    <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg p-3">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <p>{budgetError}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-2">
                    <Button variant="ghost" className="flex-1" onClick={handleSkipBudget}>
                      {t("budget.skipForNow") || "Skip for Now"}
                    </Button>
                    <Button
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      onClick={handleSetBudget}
                    >
                      {t("budget.setBudget") || "Set Budget"}
                    </Button>
                  </div>
                </>
              ) : (
                /* 50% Rule Info */
                <>
                  <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20 p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                          {t("budget.fiftyRuleTitle") || "Smart 50/50 Budget Rule"}
                        </p>
                        <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                          {t("budgetValidation.fiftyRuleDescription")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {budgetError && (
                    <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg p-3">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <p>{budgetError}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowFiftyRule(false)}
                      disabled={budgetLoading}
                    >
                      {t("budget.back") || "Back"}
                    </Button>
                    <Button
                      className="flex-1 bg-orange-600 hover:bg-orange-700"
                      onClick={handleConfirmBudget}
                      disabled={budgetLoading}
                    >
                      {budgetLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t("budget.saving") || "Saving..."}
                        </>
                      ) : (
                        t("budget.confirmBudget") || "Confirm Budget"
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>);

}
