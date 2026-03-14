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
    if (scannedData) {
      setValue("amount", scannedData.amount.toString());
      setValue("date", new Date(scannedData.date));
      if (scannedData.description) {
        setValue("description", scannedData.description);
      }
      if (scannedData.category) {
        setValue("category", scannedData.category);
      }
      toast.success("Receipt scanned successfully");
    }
  };

  useEffect(() => {
    if (transactionResult?.success && !transactionLoading) {
      toast.success(
        editMode ?
        "Transaction updated successfully" :
        "Transaction created successfully"
      );
      reset();
      router.push(`/account/${transactionResult.data.accountId}`);
    }
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
      setRecentCategories(recentByType[resolvedPrefs.defaultType || "EXPENSE"] || []);
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
      setRecentCategories(recentByType[type] || []);
    } catch (error) {
      console.error("Failed to load recent categories:", error.message);
    }
  }, [type, editMode]);

  useEffect(() => {
    if (editMode || typeof window === "undefined") return;
    if (!category) return;

    try {
      const recentCategoriesRaw = window.localStorage.getItem(RECENT_CATEGORIES_KEY);
      const recentByType = recentCategoriesRaw ? JSON.parse(recentCategoriesRaw) : {};
      const existing = recentByType[type] || [];
      const updated = [category, ...existing.filter((item) => item !== category)].slice(0, 5);
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
        <label className="text-sm font-medium">Type</label>
        <Select
          onValueChange={(value) => setValue("type", value)}
          defaultValue={type}>
          
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type &&
        <p className="text-sm text-red-500">{errors.type.message}</p>
        }
      </div>

      {}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")} />
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <p className="text-xs text-muted-foreground">Quick picks:</p>
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
          <label className="text-sm font-medium">Account</label>
          <Select
            onValueChange={(value) => setValue("accountId", value)}
            defaultValue={getValues("accountId")}>
            
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
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
                  
                  Create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.accountId &&
          <p className="text-sm text-red-500">{errors.accountId.message}</p>
          }
        </div>
      </div>

      {}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        {recentCategories.length > 0 &&
        <div className="flex flex-wrap items-center gap-2">
            <p className="text-xs text-muted-foreground">Recent:</p>
            {recentCategories.map((recentCategoryId) => {
            const categoryMeta = categories.find((item) => item.id === recentCategoryId);
            return (
              <Button
                key={recentCategoryId}
                type="button"
                size="sm"
                variant="outline"
                className="h-7 rounded-full px-3 text-xs"
                onClick={() => setValue("category", recentCategoryId, { shouldValidate: true })}>

                  {categoryMeta?.name || recentCategoryId}
                </Button>);

          })}
          </div>
        }
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}>
          
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) =>
            <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Choose the closest category now. You can refine analytics from your transaction history later.
        </p>
        {errors.category &&
        <p className="text-sm text-red-500">{errors.category.message}</p>
        }
      </div>

      {}
      <div className="space-y-2">
        <label className="text-sm font-medium">Date</label>
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" size="sm" variant="outline" className="h-7 px-3 text-xs" onClick={setToday}>
            Today
          </Button>
          <Button type="button" size="sm" variant="outline" className="h-7 px-3 text-xs" onClick={setYesterday}>
            Yesterday
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
              
              {date ? format(date, "PPP") : <span>Pick a date</span>}
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
        <label className="text-sm font-medium">Description</label>
        <Input placeholder="Enter description" {...register("description")} />
        <p className="text-xs text-muted-foreground">
          Tip: Add merchant or purpose like "Swiggy dinner" for better insights.
        </p>
        {description && description.length >= 3 &&
        <p className="text-xs text-muted-foreground">
            Looks good. This description will improve your category and trend insights.
          </p>
        }
        {errors.description &&
        <p className="text-sm text-red-500">{errors.description.message}</p>
        }
      </div>

      <div className="rounded-lg border bg-orange-50/60 p-3 text-sm dark:bg-orange-950/20">
        <p className="flex items-center gap-2 font-medium text-orange-700 dark:text-orange-300">
          <Sparkles className="h-4 w-4" />
          Premium habit for this week
        </p>
        <p className="mt-1 text-muted-foreground">
          Log transactions on the same day to keep your forecast and weekly coaching accurate.
        </p>
      </div>

      {}
      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <label className="text-base font-medium">Recurring Transaction</label>
          <div className="text-sm text-muted-foreground">
            Set up a recurring schedule for this transaction
          </div>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)} />
        
      </div>

      {}
      {isRecurring &&
      <div className="space-y-2">
          <label className="text-sm font-medium">Recurring Interval</label>
          <Select
          onValueChange={(value) => setValue("recurringInterval", value)}
          defaultValue={getValues("recurringInterval")}>
          
            <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DAILY">Daily</SelectItem>
              <SelectItem value="WEEKLY">Weekly</SelectItem>
              <SelectItem value="MONTHLY">Monthly</SelectItem>
              <SelectItem value="YEARLY">Yearly</SelectItem>
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
          
          Cancel
        </Button>
        <Button type="submit" className="w-full" disabled={transactionLoading}>
          {transactionLoading ?
          <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {editMode ? "Updating..." : "Creating..."}
            </> :
          editMode ?
          "Update Transaction" :

          "Create Transaction"
          }
        </Button>
      </div>
    </form>);

}
