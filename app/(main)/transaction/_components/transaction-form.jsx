"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger } from
"@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { cn } from "@/lib/utils";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import { ReceiptScanner } from "./recipt-scanner";
import { useLanguage } from "@/components/language-provider";
import { normalizeCategoryKey } from "@/lib/category-utils";

const QUICK_ADD_PREFS_KEY = "gullak.quickAddPrefs";
const LAST_DRAFT_KEY = "gullak.lastTransactionDraft";
const RECENT_CATEGORIES_KEY = "gullak.recentCategories";

const DEFAULT_QUICK_PREFS = {
  rememberLast: true,
  defaultType: "EXPENSE",
  amountProfile: "standard",
  defaultAccountId: "auto"
};

function getQuickAmountPresets(type, profile) {
  const expensePresets = {
    compact: [100, 250, 500],
    standard: [100, 250, 500, 1000, 2000],
    premium: [250, 500, 1000, 2500, 5000]
  };

  const incomePresets = {
    compact: [500, 1000, 2500],
    standard: [500, 1000, 2500, 5000, 10000],
    premium: [1000, 2500, 5000, 10000, 20000]
  };

  const presetGroup = type === "EXPENSE" ? expensePresets : incomePresets;
  return presetGroup[profile] || presetGroup.standard;
}

export function AddTransactionForm({
  accounts,
  categories,
  editMode = false,
  initialData = null
}) {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const [quickPrefs, setQuickPrefs] = useState(DEFAULT_QUICK_PREFS);
  const [recentCategories, setRecentCategories] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues,
    reset
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues:
    editMode && initialData ?
    {
      type: initialData.type,
      amount: initialData.amount.toString(),
      description: initialData.description,
      accountId: initialData.accountId,
      category: initialData.category,
      date: new Date(initialData.date),
      isRecurring: initialData.isRecurring,
      ...(initialData.recurringInterval && {
        recurringInterval: initialData.recurringInterval
      })
    } :
    {
      type: "EXPENSE",
      amount: "",
      description: "",
      accountId: accounts.find((ac) => ac.isDefault)?.id,
      date: new Date(),
      isRecurring: false
    }
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult
  } = useFetch(editMode ? updateTransaction : createTransaction);

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount)
    };

    if (editMode) {
      transactionFn(editId, formData);
    } else {
      transactionFn(formData);
    }
  };

  const handleScanComplete = (scannedData) => {
    if (!scannedData || typeof scannedData !== "object") return;

    const scannedAmount = Number(scannedData.amount);
    const scannedDate = new Date(scannedData.date);

    if (!Number.isFinite(scannedAmount) || scannedAmount <= 0 || Number.isNaN(scannedDate.getTime())) {
      toast.error(t("transaction.scanInvalid", {}, "Scanned data was incomplete. Please fill the fields manually."));
      return;
    }

    setValue("amount", scannedAmount.toString(), { shouldValidate: true });
    setValue("date", scannedDate, { shouldValidate: true });

    if (typeof scannedData.description === "string" && scannedData.description.trim().length > 0) {
      setValue("description", scannedData.description.trim(), { shouldValidate: true });
    }
    if (typeof scannedData.category === "string" && scannedData.category.trim().length > 0) {
      setValue("category", normalizeCategoryKey(scannedData.category), { shouldValidate: true });
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode ?
        t("transaction.updatedSuccess") :
        t("transaction.createdSuccess")
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionResult, transactionLoading, editMode]);

  const type = watch("type");
  const accountId = watch("accountId");
  const category = watch("category");
  const description = watch("description");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  useEffect(() => {
    if (editMode || typeof window === "undefined") return;

    try {
      const storedPrefs = window.localStorage.getItem(QUICK_ADD_PREFS_KEY);
      const parsedPrefs = storedPrefs ? JSON.parse(storedPrefs) : DEFAULT_QUICK_PREFS;
      const resolvedPrefs = { ...DEFAULT_QUICK_PREFS, ...parsedPrefs };
      setQuickPrefs(resolvedPrefs);

      const storedDraftRaw = window.localStorage.getItem(LAST_DRAFT_KEY);
      const storedDraft = storedDraftRaw ? JSON.parse(storedDraftRaw) : null;

      if (resolvedPrefs.defaultType) {
        setValue("type", resolvedPrefs.defaultType, { shouldValidate: true });
      }

      if (
      resolvedPrefs.defaultAccountId &&
      resolvedPrefs.defaultAccountId !== "auto" &&
      accounts.some((account) => account.id === resolvedPrefs.defaultAccountId))
      {
        setValue("accountId", resolvedPrefs.defaultAccountId, { shouldValidate: true });
      }

      if (resolvedPrefs.rememberLast && storedDraft) {
        if (storedDraft.type) {
          setValue("type", storedDraft.type, { shouldValidate: true });
        }
        if (storedDraft.accountId && accounts.some((account) => account.id === storedDraft.accountId)) {
          setValue("accountId", storedDraft.accountId, { shouldValidate: true });
        }
      }

      const recentCategoriesRaw = window.localStorage.getItem(RECENT_CATEGORIES_KEY);
      const recentByType = recentCategoriesRaw ? JSON.parse(recentCategoriesRaw) : {};
      const normalizedRecent = (recentByType[resolvedPrefs.defaultType || "EXPENSE"] || [])
        .map((value) => normalizeCategoryKey(value))
        .filter((value, index, arr) => value && arr.indexOf(value) === index);
      setRecentCategories(normalizedRecent);
    } catch (error) {
      console.error("Failed to load quick-add preferences:", error.message);
    }
  }, [editMode, setValue, accounts]);

  useEffect(() => {
    if (editMode || typeof window === "undefined") return;

    if (!quickPrefs.rememberLast) return;

    try {
      window.localStorage.setItem(
        LAST_DRAFT_KEY,
        JSON.stringify({
          type,
          accountId
        })
      );
    } catch (error) {
      console.error("Failed to store transaction draft:", error.message);
    }
  }, [type, accountId, quickPrefs.rememberLast, editMode]);

  useEffect(() => {
    if (editMode || typeof window === "undefined") return;

    try {
      const recentCategoriesRaw = window.localStorage.getItem(RECENT_CATEGORIES_KEY);
      const recentByType = recentCategoriesRaw ? JSON.parse(recentCategoriesRaw) : {};
      const normalizedRecent = (recentByType[type] || [])
        .map((value) => normalizeCategoryKey(value))
        .filter((value, index, arr) => value && arr.indexOf(value) === index);
      setRecentCategories(normalizedRecent);
    } catch (error) {
      console.error("Failed to load recent categories:", error.message);
    }
  }, [type, editMode]);

  useEffect(() => {
    if (editMode || typeof window === "undefined") return;
    if (!category) return;

    try {
      const normalizedCategory = normalizeCategoryKey(category);
      const recentCategoriesRaw = window.localStorage.getItem(RECENT_CATEGORIES_KEY);
      const recentByType = recentCategoriesRaw ? JSON.parse(recentCategoriesRaw) : {};
      const existing = recentByType[type] || [];
      const updated = [
        normalizedCategory,
        ...existing
          .map((item) => normalizeCategoryKey(item))
          .filter((item) => item !== normalizedCategory)]
        .filter((item, index, arr) => item && arr.indexOf(item) === index)
        .slice(0, 5);
      const nextState = { ...recentByType, [type]: updated };
      window.localStorage.setItem(RECENT_CATEGORIES_KEY, JSON.stringify(nextState));
      setRecentCategories(updated);
    } catch (error) {
      console.error("Failed to persist recent categories:", error.message);
    }
  }, [category, type, editMode]);

  const filteredCategories = categories.filter(
    (category) => category.type === type
  );

  const quickAmounts = getQuickAmountPresets(type, quickPrefs.amountProfile);

  const setToday = () => setValue("date", new Date(), { shouldValidate: true });
  const setYesterday = () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    setValue("date", yesterday, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {}
      {!editMode && <ReceiptScanner onScanComplete={handleScanComplete} />}

      {}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("transaction.type")}</label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}>
          
          <SelectTrigger>
            <SelectValue placeholder={t("transaction.selectType")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">{t("transaction.expense")}</SelectItem>
            <SelectItem value="INCOME">{t("transaction.income")}</SelectItem>
            <SelectItem value="TRANSFER">{t("transaction.transfer")}</SelectItem>
          </SelectContent>
        </Select>
        {errors.type &&
        <p className="text-sm text-red-500">{errors.type.message}</p>
        }
      </div>

      {}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">{t("transaction.amount")}</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")} />
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <p className="text-xs text-muted-foreground">{t("transaction.quickPicks")}</p>
            {quickAmounts.map((value) =>
            <Button
              key={value}
              type="button"
              variant="outline"
              size="sm"
              className="h-7 rounded-full px-3 text-xs"
              onClick={() => setValue("amount", value.toString(), { shouldValidate: true })}>

                ₹{value}
              </Button>
            )}
          </div>
          
          {errors.amount &&
          <p className="text-sm text-red-500">{errors.amount.message}</p>
          }
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{type === "TRANSFER" ? t("transaction.fromAccount") : t("transaction.account")}</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}>
            
            <SelectTrigger>
              <SelectValue placeholder={t("transaction.selectAccount")} />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) =>
              <SelectItem key={account.id} value={account.id}>
                  {account.name} (₹{parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              )}
              <CreateAccountDrawer>
                <Button
                  variant="ghost"
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
                  
                  {t("transaction.createAccount")}
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId &&
          <p className="text-sm text-red-500">{errors.accountId.message}</p>
          }
        </div>

        {type === "TRANSFER" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("transaction.toAccount")}</label>
            <Select
              onValueChange={(value) => setValue("toAccountId", value)}
              defaultValue={getValues("toAccountId")}>
              
              <SelectTrigger>
                <SelectValue placeholder={t("transaction.selectDestAccount")} />
              </SelectTrigger>
              <SelectContent>
                {accounts.filter(a => a.id !== accountId).map((account) =>
                <SelectItem key={account.id} value={account.id}>
                    {account.name} (₹{parseFloat(account.balance).toFixed(2)})
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {errors.toAccountId &&
            <p className="text-sm text-red-500">{errors.toAccountId.message}</p>
            }
          </div>
        )}
      </div>

      {}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("transaction.category")}</label>
        {recentCategories.length > 0 &&
        <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs text-muted-foreground">{t("transaction.recent")}</p>
            {recentCategories.map((recentCategoryId) => {
            const normalizedRecentCategoryId = normalizeCategoryKey(recentCategoryId);
            const categoryMeta = categories.find((item) => item.id === normalizedRecentCategoryId);
            return (
              <Button
                  key={normalizedRecentCategoryId}
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 rounded-full px-3 text-xs"
                  onClick={() => setValue("category", normalizedRecentCategoryId, { shouldValidate: true })}>
                    {t(`categories.${normalizedRecentCategoryId}`, {}, categoryMeta?.name || normalizedRecentCategoryId)}
              </Button>
            );

          })}
          </div>
        }
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}>
          
          <SelectTrigger>
            <SelectValue placeholder={t("transaction.selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) =>
            <SelectItem key={category.id} value={category.id}>
                {t(`categories.${category.id}`, {}, category.name)}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {t("transaction.categoryHint")}
        </p>
        {errors.category &&
        <p className="text-sm text-red-500">{errors.category.message}</p>
        }
      </div>

      {}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("transaction.date")}</label>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" variant="outline" className="h-7 px-3 text-xs" onClick={setToday}>
            {t("transaction.today")}
          </Button>
          <Button type="button" size="sm" variant="outline" className="h-7 px-3 text-xs" onClick={setYesterday}>
            {t("transaction.yesterday")}
          </Button>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}>
              
              {date ? format(date, "PPP") : <span>{t("transaction.pickDate")}</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus />
            
          </PopoverContent>
        </Popover>
        {errors.date &&
        <p className="text-sm text-red-500">{errors.date.message}</p>
        }
      </div>

      {}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t("transaction.description")}</label>
        <Input placeholder={t("transaction.enterDescription")} {...register("description")} />
        <p className="text-xs text-muted-foreground">
          {t("transaction.descriptionTip")}
        </p>
        {description && description.length >= 3 &&
        <p className="text-xs text-muted-foreground">
            {t("transaction.descriptionGood")}
          </p>
        }
        {errors.description &&
        <p className="text-sm text-red-500">{errors.description.message}</p>
        }
      </div>

      <div className="rounded-lg border bg-orange-50/60 p-3 text-sm dark:bg-orange-950/20">
        <p className="flex items-center gap-2 font-medium text-orange-700 dark:text-orange-300">
          <Sparkles className="h-4 w-4" />
          {t("transaction.premiumHabit")}
        </p>
        <p className="mt-1 text-muted-foreground">
          {t("transaction.premiumHabitHint")}
        </p>
      </div>

      {}
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label className="text-base font-medium">{t("transaction.recurringTransaction")}</label>
          <div className="text-sm text-muted-foreground">
            {t("transaction.recurringHint")}
          </div>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)} />
        
      </div>

      {}
      {isRecurring &&
      <div className="space-y-2">
          <label className="text-sm font-medium">{t("transaction.recurringInterval")}</label>
          <Select
          onValueChange={(value) => setValue("recurringInterval", value)}
          defaultValue={getValues("recurringInterval")}>
          
            <SelectTrigger>
              <SelectValue placeholder={t("transaction.selectInterval")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">{t("transaction.daily")}</SelectItem>
              <SelectItem value="WEEKLY">{t("transaction.weekly")}</SelectItem>
              <SelectItem value="MONTHLY">{t("transaction.monthly")}</SelectItem>
              <SelectItem value="YEARLY">{t("transaction.yearly")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval &&
        <p className="text-sm text-red-500">
              {errors.recurringInterval.message}
            </p>
        }
        </div>
      }

      {}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.back()}>
          
          {t("transaction.cancel")}
        </Button>
        <Button type="submit" className="w-full" disabled={transactionLoading}>
          {transactionLoading ?
          <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? t("transaction.updating") : t("transaction.creating")}
            </> :
          editMode ?
          t("transaction.updateTransaction") :

          t("transaction.createTransaction")
          }
        </Button>
      </div>
    </form>);

}
