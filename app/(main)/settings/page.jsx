"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue } from
"@/components/ui/select";
import { toast } from "sonner";
import {
  updatePhoneNumber,
  getPhoneNumber,
  deleteCurrentUserAccount } from
"@/actions/settings";
import { getUserAccounts } from "@/actions/dashboard";
import { deleteAccount, updateDefaultAccount } from "@/actions/account";
import { getAccountsBudgetStatus, updateBudget } from "@/actions/budget";
import { Trash2, Sun, Moon, Monitor, Phone, Mail, Plus, SlidersHorizontal, Globe } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/components/language-provider";
import LanguageSwitcher from "@/components/language-switcher";

const QUICK_ADD_PREFS_KEY = "gullak.quickAddPrefs";
const DEFAULT_QUICK_PREFS = {
  rememberLast: true,
  defaultType: "EXPENSE",
  amountProfile: "standard",
  defaultAccountId: "auto"
};

export default function SettingsPage() {
  const { t } = useLanguage();
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [budgetMap, setBudgetMap] = useState({});
  const [editingBudget, setEditingBudget] = useState(null);
  const [editBudgetAmount, setEditBudgetAmount] = useState("");
  const [savingBudget, setSavingBudget] = useState(false);
  const [quickPrefs, setQuickPrefs] = useState(DEFAULT_QUICK_PREFS);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getPhoneNumber().then((num) => {
      if (num) {
        setPhone(num);
      }
    });

    try {
      const savedPrefs = localStorage.getItem(QUICK_ADD_PREFS_KEY);
      if (savedPrefs) {
        setQuickPrefs({ ...DEFAULT_QUICK_PREFS, ...JSON.parse(savedPrefs) });
      }
    } catch (error) {
      console.error("Failed to load quick-add preferences:", error.message);
    }

    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const [accs, statuses] = await Promise.all([
        getUserAccounts(),
        getAccountsBudgetStatus()
      ]);
      if (accs) setAccounts(accs);
      if (statuses) {
        const map = {};
        statuses.forEach(s => map[s.id] = s.currentBudget);
        setBudgetMap(map);
      }
    } catch (e) {
      console.error("Failed to load accounts", e);
    }
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleteResult,
    error: deleteError
  } = useFetch(deleteAccount);

  const {
    loading: defaultLoading,
    fn: updateDefaultFn,
    data: updateDefaultResult,
    error: defaultError
  } = useFetch(updateDefaultAccount);

  const {
    loading: deletingUser,
    fn: deleteUserFn,
    data: deleteUserResult,
    error: deleteUserError
  } = useFetch(deleteCurrentUserAccount);

  useEffect(() => {
    if (deleteResult?.success) {
      toast.success(t("settings.accountDeleted"));
      loadAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteResult]);

  useEffect(() => {
    if (updateDefaultResult?.success) {
      toast.success(t("settings.defaultUpdated"));
      loadAccounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDefaultResult]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError.message || t("settings.failedDelete"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteError]);

  useEffect(() => {
    if (defaultError) {
      toast.error(defaultError.message || t("settings.failedDefault"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultError]);

  useEffect(() => {
    if (deleteUserResult?.success) {
      toast.success(
        t(
          "settings.profileDeleted",
          {},
          "Your account has been deleted. Redirecting..."
        )
      );

      window.setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    }
  }, [deleteUserResult, t]);

  useEffect(() => {
    if (deleteUserError) {
      toast.error(
        deleteUserError.message ||
        t("settings.failedDeleteProfile", {}, "Failed to delete account")
      );
    }
  }, [deleteUserError, t]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updatePhoneNumber(phone);
      if (result.success) {
        toast.success(phone ? t("settings.phoneSaved") : t("settings.phoneRemoved"));
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error(t("settings.failedSavePhone"));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async (id, name, isDefault) => {
    if (isDefault) {
      toast.error(t("settings.cannotDeleteDefault"));
      return;
    }
    if (!window.confirm(t("settings.confirmDelete", { name })))
    return;
    await deleteFn(id);
  };

  const handleDeleteProfile = async () => {
    const confirmed = window.confirm(
      t(
        "settings.confirmDeleteProfile",
        {},
        "This will permanently delete your entire account and all data. This cannot be undone. Continue?"
      )
    );

    if (!confirmed) {
      return;
    }

    await deleteUserFn();
  };

  const handleSetDefaultAccount = async (account) => {
    if (account.isDefault) {
      return;
    }

    await updateDefaultFn(account.id);
  };

  const handleSaveQuickPrefs = () => {
    try {
      localStorage.setItem(QUICK_ADD_PREFS_KEY, JSON.stringify(quickPrefs));
      toast.success(t("settings.quickPrefsSaved"));
    } catch (error) {
      toast.error(t("settings.failedSavePrefs"));
      console.error("Failed to save quick-add preferences:", error.message);
    }
  };

  const handleResetQuickPrefs = () => {
    setQuickPrefs(DEFAULT_QUICK_PREFS);
    try {
      localStorage.setItem(QUICK_ADD_PREFS_KEY, JSON.stringify(DEFAULT_QUICK_PREFS));
      toast.success(t("settings.quickPrefsReset"));
    } catch (error) {
      toast.error(t("settings.failedResetPrefs"));
      console.error("Failed to reset quick-add preferences:", error.message);
    }
  };

  const handleSaveBudget = async (accountId) => {
    const amount = parseFloat(editBudgetAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error(t("budget.invalidAmount") || "Invalid amount");
      return;
    }
    const account = accounts.find(a => a.id === accountId);
    if (amount > account.balance * 0.5) {
      toast.error(t("budgetValidation.exceedsFiftyPercent", { maxAmount: (account.balance * 0.5).toFixed(2) }));
      return;
    }

    setSavingBudget(true);
    try {
      const result = await updateBudget(amount, accountId);
      if (result.success) {
        toast.success(t("budget.updatedSuccess") || "Budget updated");
        setBudgetMap(prev => ({ ...prev, [accountId]: amount }));
        setEditingBudget(null);
      } else {
        toast.error(result.error);
      }
    } catch (e) {
      toast.error(t("budget.failedUpdate") || "Failed to update budget");
    } finally {
      setSavingBudget(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-4xl font-bold gradient-title">{t("settings.title")}</h1>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t("settings.appearance")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {t("settings.preferredTheme")}
          </p>
          {mounted &&
          <div className="flex gap-3">
              {[
            { value: "light", icon: Sun, label: t("settings.light") },
            { value: "dark", icon: Moon, label: t("settings.dark") },
            { value: "system", icon: Monitor, label: t("settings.system") }].
            map((opt) =>
            <Button
              key={opt.value}
              variant={theme === opt.value ? "default" : "outline"}
              size="sm"
              onClick={() => setTheme(opt.value)}
              className="flex items-center gap-2">
              
                  <opt.icon className="h-4 w-4" />
                  {opt.label}
                </Button>
            )}
            </div>
          }
        </CardContent>
      </Card>

      {/* Language Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t("settings.languageTitle") || "Language"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("settings.languageDesc") || "Choose your preferred language for the application."}
          </p>
          <LanguageSwitcher className="w-full max-w-xs" />
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5" />
            {t("settings.smsNotifications")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {t("settings.phoneNumberDesc")}
          </p>
          <div>
            <Input
              type="tel"
              placeholder="+919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} />

            <p className="text-xs text-muted-foreground mt-1">
              {t("settings.phoneFormat")}
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? t("settings.saving") : t("settings.save")}
            </Button>
            {phone &&
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700"
              onClick={() => {
                setPhone("");
                updatePhoneNumber("").then((result) => {
                  if (result.success) {
                    toast.success(t("settings.phoneRemoved"));
                  }
                });
              }}>
              
                {t("settings.remove")}
              </Button>
            }
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            {t("settings.quickAddPreferences")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div>
              <p className="text-sm font-medium">{t("settings.rememberLastDraft")}</p>
              <p className="text-xs text-muted-foreground">{t("settings.rememberLastDraftDesc")}</p>
            </div>
            <Switch
              checked={quickPrefs.rememberLast}
              onCheckedChange={(checked) => setQuickPrefs((prev) => ({ ...prev, rememberLast: checked }))} />

          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">{t("settings.defaultTransactionType")}</p>
              <Select
                value={quickPrefs.defaultType}
                onValueChange={(value) => setQuickPrefs((prev) => ({ ...prev, defaultType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t("settings.selectDefaultType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXPENSE">{t("transaction.expense")}</SelectItem>
                  <SelectItem value="INCOME">{t("transaction.income")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">{t("settings.quickAmountProfile")}</p>
              <Select
                value={quickPrefs.amountProfile}
                onValueChange={(value) => setQuickPrefs((prev) => ({ ...prev, amountProfile: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder={t("settings.selectAmountProfile")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">{t("settings.compact")}</SelectItem>
                  <SelectItem value="standard">{t("settings.standard")}</SelectItem>
                  <SelectItem value="premium">{t("settings.premium")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">{t("settings.defaultQuickAddAccount")}</p>
            <Select
              value={quickPrefs.defaultAccountId}
              onValueChange={(value) => setQuickPrefs((prev) => ({ ...prev, defaultAccountId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder={t("settings.chooseDefaultAccount")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">{t("settings.autoAccount")}</SelectItem>
                {accounts.map((account) =>
                <SelectItem key={account.id} value={account.id}>
                    {account.name}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSaveQuickPrefs}>{t("settings.savePreferences")}</Button>
            <Button variant="outline" onClick={handleResetQuickPrefs}>{t("settings.reset")}</Button>
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">{t("settings.manageAccounts")}</CardTitle>
          <CreateAccountDrawer>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              {t("settings.addAccount")}
            </Button>
          </CreateAccountDrawer>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ?
          <p className="text-sm text-muted-foreground">
              {t("settings.noAccounts")}
            </p> :

          <div className="space-y-3">
              {accounts.map((account) =>
            <div
              key={account.id}
              className="flex flex-col space-y-2 p-3 rounded-lg border">
              <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">
                      {account.name}
                      {account.isDefault &&
                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          {t("settings.defaultBadge")}
                        </span>
                  }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {account.type} &middot; ₹
                      {parseFloat(account.balance).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{t("settings.defaultToggle")}</span>
                      <Switch
                    checked={account.isDefault}
                    onCheckedChange={() => handleSetDefaultAccount(account)}
                    disabled={defaultLoading} />
                  
                    </div>
                    {!account.isDefault &&
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() =>
                  handleDeleteAccount(
                    account.id,
                    account.name,
                    account.isDefault
                  )
                  }
                  disabled={deleteLoading}>
                  
                        <Trash2 className="h-4 w-4" />
                      </Button>
                }
                  </div>
                </div>
                
                {/* Budget Section */}
                <div className="pt-1">
                  {editingBudget === account.id ? (
                    <div className="flex items-center gap-2 mt-2 bg-muted/30 p-2 rounded-md">
                      <span className="text-xs font-medium text-muted-foreground w-16">{t("settings.budgetLabel")}</span>
                      <Input 
                        type="number" 
                        step="0.01" 
                        value={editBudgetAmount} 
                        onChange={e => setEditBudgetAmount(e.target.value)} 
                        className="h-8 w-24 text-sm" 
                        placeholder={t("settings.budgetAmtPlaceholder")}
                      />
                      <Button size="sm" onClick={() => handleSaveBudget(account.id)} disabled={savingBudget} className="h-8">
                        {savingBudget ? t("settings.saving") : t("settings.save")}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingBudget(null)} disabled={savingBudget} className="h-8">
                        {t("accountCard.cancel") || "Cancel"}
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between mt-2 bg-muted/30 px-3 py-1.5 rounded-md">
                      <span className="text-xs text-muted-foreground">
                        {t("budget.monthlyBudget") || "Monthly Budget"}: <span className="font-medium text-foreground ml-1">{budgetMap[account.id] ? `₹${parseFloat(budgetMap[account.id]).toFixed(2)}` : t("budget.noBudgetSet") || "Not set"}</span>
                      </span>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="h-6 text-xs px-2" 
                        onClick={() => { 
                          setEditingBudget(account.id); 
                          setEditBudgetAmount(budgetMap[account.id] || ""); 
                        }}
                      >
                        {t("transactionTable.edit") || "Edit"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
            </div>
          }
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {t("settings.contactUs")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            {t("settings.contactHelper")}
          </p>
          <div className="space-y-1 text-sm">
            <p>
              {t("settings.emailLabel")}{" "}
              <a
                href="mailto:support@gullak.app"
                className="text-orange-600 hover:underline">

                support@gullak.app
              </a>
            </p>
            <p className="text-muted-foreground">
              {t("settings.respondTime")}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-300">
        <CardHeader>
          <CardTitle className="text-lg text-red-600">
            {t("settings.dangerZone", {}, "Danger Zone")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t(
              "settings.deleteProfileDescription",
              {},
              "Delete your account from both Clerk and the app database. This will permanently remove all accounts, transactions, budgets, and goals."
            )}
          </p>
          <Button
            variant="destructive"
            onClick={handleDeleteProfile}
            disabled={deletingUser}>

            {deletingUser ?
            t("settings.deletingProfile", {}, "Deleting account...") :
            t("settings.deleteProfile", {}, "Delete my account")}
          </Button>
        </CardContent>
      </Card>
    </div>);

}
