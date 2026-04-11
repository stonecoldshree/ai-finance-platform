"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Loader2,
  PiggyBank,
  Globe,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Wallet,
  Languages
} from "lucide-react";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";

import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
import { LOCALE_LABELS, SUPPORTED_LOCALES } from "@/lib/i18n/config";

const ONBOARDED_KEY = "gullak.onboarded";

/**
 * 4-step onboarding wizard for new users:
 * 1. Welcome
 * 2. Add first bank account
 * 3. Choose language
 * 4. Set budget (with 50% rule)
 */
export function OnboardingWizard({ hasAccounts = false }) {
  const { t, locale, setLocale } = useLanguage();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0); // 0=welcome, 1=account, 2=language, 3=budget
  const [createdAccount, setCreatedAccount] = useState(null);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [showFiftyRule, setShowFiftyRule] = useState(false);
  const [selectedLocale, setSelectedLocale] = useState(locale);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: true
    }
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    data: newAccount,
    error: accountError
  } = useFetch(createAccount);

  const {
    loading: budgetLoading,
    fn: saveBudgetFn,
    data: budgetResult,
    error: budgetSaveError
  } = useFetch(updateBudget);

  // Show wizard only for users without accounts, and not already onboarded
  useEffect(() => {
    if (!hasAccounts) {
      const onboarded = localStorage.getItem(ONBOARDED_KEY);
      if (!onboarded) {
        setOpen(true);
      }
    }
  }, [hasAccounts]);

  // Account creation success
  useEffect(() => {
    if (newAccount?.success && newAccount?.data) {
      toast.success(t("createAccountDrawer.createdSuccess") || "Account created!");
      setCreatedAccount(newAccount.data);
      setStep(3); // Go to budget step
    }
  }, [newAccount]);

  useEffect(() => {
    if (accountError) {
      toast.error(accountError.message || "Failed to create account");
    }
  }, [accountError]);

  // Budget save success
  useEffect(() => {
    if (budgetResult?.success) {
      toast.success(t("budget.updatedSuccess") || "Budget set!");
      completeOnboarding();
    }
  }, [budgetResult]);

  useEffect(() => {
    if (budgetSaveError) {
      setBudgetError(budgetSaveError.message || "Failed to set budget");
    }
  }, [budgetSaveError]);

  const onAccountSubmit = async (data) => {
    await createAccountFn(data);
  };

  const handleLanguageConfirm = () => {
    if (selectedLocale !== locale) {
      setLocale(selectedLocale);
    }
    setStep(2); // Go to account step
  };

  const handleSetBudget = () => {
    const amount = parseFloat(budgetAmount);
    if (isNaN(amount) || amount <= 0) {
      setBudgetError(t("budget.invalidAmount") || "Please enter a valid budget amount");
      return;
    }

    const balance = parseFloat(createdAccount.balance);
    if (amount > balance) {
      setBudgetError(`Budget cannot exceed your account balance of ₹${balance.toFixed(2)}`);
      return;
    }

    setBudgetError("");
    setShowFiftyRule(true);
  };

  const handleConfirmBudget = async () => {
    const amount = parseFloat(budgetAmount);
    await saveBudgetFn(amount, createdAccount.id);
  };

  const handleSkipBudget = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    localStorage.setItem(ONBOARDED_KEY, "true");
    setOpen(false);
    router.refresh();
  };

  const effectiveBudget = parseFloat(budgetAmount || 0) / 2;

  const steps = [
    { icon: Sparkles, label: t("onboarding.welcome") || "Welcome" },
    { icon: Languages, label: t("onboarding.language") || "Language" },
    { icon: Wallet, label: t("onboarding.account") || "Account" },
    { icon: PiggyBank, label: t("onboarding.budget") || "Budget" },
  ];

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-lg p-0 overflow-hidden">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 px-6 pt-6">
          {steps.map((s, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium transition-all ${
                i === step
                  ? "bg-orange-500 text-white scale-110"
                  : i < step
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                    : "bg-muted text-muted-foreground"
              }`}>
                {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-0.5 w-6 transition-colors ${
                  i < step ? "bg-green-400" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="px-6 pb-6 pt-4">
          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/30 p-8 w-fit">
                <PiggyBank className="h-16 w-16 text-orange-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  {t("onboarding.welcomeTitle") || "Welcome to Gullak! 🎉"}
                </h2>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                  {t("onboarding.welcomeDesc") || "Let's set up your profile in just a few steps. Add a bank account, choose your language, and set a monthly budget."}
                </p>
              </div>
              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 gap-2"
                onClick={() => setStep(1)}
              >
                {t("onboarding.getStarted") || "Get Started"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Step 1: Choose Language */}
          {step === 1 && (
            <div className="space-y-5 py-2">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                  <Globe className="h-5 w-5 text-orange-500" />
                  {t("onboarding.chooseLanguage") || "Choose Your Language"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("onboarding.languageDesc") || "Select your preferred language for the app."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {SUPPORTED_LOCALES.map((code) => (
                  <button
                    key={code}
                    onClick={() => setSelectedLocale(code)}
                    className={`rounded-lg border p-3 text-sm font-medium transition-all text-center ${
                      selectedLocale === code
                        ? "border-orange-500 bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-300 ring-2 ring-orange-500/20"
                        : "border-border hover:border-orange-200 hover:bg-orange-50/50 dark:hover:bg-orange-950/10"
                    }`}
                  >
                    {LOCALE_LABELS[code]}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(0)} className="flex-1">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  {t("onboarding.back") || "Back"}
                </Button>
                <Button
                  className="flex-1 bg-orange-600 hover:bg-orange-700 gap-2"
                  onClick={handleLanguageConfirm}
                >
                  {t("onboarding.continue") || "Continue"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Add Account */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold">
                  {t("onboarding.addAccountTitle", {}, "Add Your Bank Account")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("onboarding.addAccountDesc", {}, "Enter the details of your primary bank account.")}
                </p>
              </div>

              <form onSubmit={handleSubmit(onAccountSubmit)} className="space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="ob-name" className="text-sm font-medium">
                    {t("createAccountDrawer.accountName")}
                  </label>
                  <Input
                    id="ob-name"
                    placeholder={t("createAccountDrawer.namePlaceholder") || "e.g. HDFC Savings"}
                    {...register("name")}
                  />
                  {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="ob-type" className="text-sm font-medium">
                    {t("createAccountDrawer.accountType")}
                  </label>
                  <Select
                    onValueChange={(value) => setValue("type", value)}
                    defaultValue={watch("type")}
                  >
                    <SelectTrigger id="ob-type">
                      <SelectValue placeholder={t("createAccountDrawer.selectType")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CURRENT">{t("createAccountDrawer.current")}</SelectItem>
                      <SelectItem value="SAVINGS">{t("createAccountDrawer.savings")}</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && <p className="text-xs text-red-500">{errors.type.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="ob-balance" className="text-sm font-medium">
                    {t("createAccountDrawer.initialBalance")}
                  </label>
                  <Input
                    id="ob-balance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("balance")}
                  />
                  {errors.balance && <p className="text-xs text-red-500">{errors.balance.message}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 gap-2"
                  disabled={createAccountLoading}
                >
                  {createAccountLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("createAccountDrawer.creating")}
                    </>
                  ) : (
                    <>
                      {t("createAccountDrawer.createAccount")}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}


          {/* Step 3: Set Budget */}
          {step === 3 && (
            <div className="space-y-4 py-2">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-semibold">
                  {t("onboarding.setBudgetTitle") || "Set Your Monthly Budget"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t("onboarding.setBudgetDesc") || "How much do you plan to spend this month?"}
                </p>
              </div>

              {/* Account info */}
              <div className="rounded-xl border bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/10 p-3">
                <p className="text-xs text-muted-foreground">{t("budget.account") || "Account"}</p>
                <p className="text-sm font-semibold capitalize">{createdAccount?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t("budget.balance") || "Balance"}: ₹{parseFloat(createdAccount?.balance || 0).toFixed(2)}
                </p>
              </div>

              {!showFiftyRule ? (
                <>
                  <div className="space-y-1.5">
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

                  <div className="flex gap-3">
                    <Button variant="ghost" className="flex-1" onClick={handleSkipBudget}>
                      {t("budget.skipForNow") || "Skip"}
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
                <>
                  <div className="rounded-xl border border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-950/20 p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                          {t("budget.fiftyRuleTitle") || "Smart 50/50 Budget Rule"}
                        </p>
                        <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">
                          {t("budget.fiftyRuleDesc") || "Gullak will consider only 50% of your budget for spending. The remaining 50% should be saved or invested."}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div className="rounded-lg bg-white/70 dark:bg-background/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">{t("budget.spendingBudget") || "Spending"}</p>
                        <p className="text-lg font-bold text-orange-600">₹{effectiveBudget.toFixed(2)}</p>
                      </div>
                      <div className="rounded-lg bg-white/70 dark:bg-background/50 p-3 text-center">
                        <p className="text-xs text-muted-foreground">{t("budget.savingsTarget") || "Save / Invest"}</p>
                        <p className="text-lg font-bold text-green-600">₹{effectiveBudget.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {budgetError && (
                    <div className="flex items-center gap-2 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-lg p-3">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <p>{budgetError}</p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setShowFiftyRule(false)} disabled={budgetLoading}>
                      <ArrowLeft className="h-4 w-4 mr-1" />
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
                        <>
                          {t("onboarding.finish") || "Finish Setup"}
                          <CheckCircle2 className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
