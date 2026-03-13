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
import { updatePhoneNumber, getPhoneNumber } from "@/actions/settings";
import { sendTestSMS } from "@/actions/test-send-sms";
import { getUserAccounts } from "@/actions/dashboard";
import { deleteAccount, updateDefaultAccount } from "@/actions/account";
import { Trash2, Sun, Moon, Monitor, Phone, Mail, Plus } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { CreateAccountDrawer } from "@/components/create-account-drawer";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getPhoneNumber().then((num) => {
      if (num) {
        setPhone(num);
        setHasPhone(true);
      }
    });
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    getUserAccounts().then((accs) => {
      if (accs) setAccounts(accs);
    });
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

  useEffect(() => {
    if (deleteResult?.success) {
      toast.success("Account deleted successfully");
      loadAccounts();
    }
  }, [deleteResult]);

  useEffect(() => {
    if (updateDefaultResult?.success) {
      toast.success("Default account updated successfully");
      loadAccounts();
    }
  }, [updateDefaultResult]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError.message || "Failed to delete account");
    }
  }, [deleteError]);

  useEffect(() => {
    if (defaultError) {
      toast.error(defaultError.message || "Failed to update default account");
    }
  }, [defaultError]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const result = await updatePhoneNumber(phone);
      if (result.success) {
        toast.success(phone ? "Phone number saved!" : "Phone number removed.");
        setHasPhone(!!phone);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to save phone number");
    } finally {
      setSaving(false);
    }
  };

  const handleTestSMS = async () => {
    setTesting(true);
    try {
      const result = await sendTestSMS();
      if (result.success) {
        toast.success(`Test SMS sent to ${result.phoneNumber}`);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Failed to send test SMS");
    } finally {
      setTesting(false);
    }
  };

  const handleDeleteAccount = async (id, name, isDefault) => {
    if (isDefault) {
      toast.error(
        "Cannot delete the default account. Set another account as default first."
      );
      return;
    }
    if (!window.confirm(`Delete "${name}"? All transactions will be lost.`))
    return;
    await deleteFn(id);
  };

  const handleSetDefaultAccount = async (account) => {
    if (account.isDefault) {
      return;
    }

    await updateDefaultFn(account.id);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-4xl font-bold gradient-title">Settings</h1>

      {}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Appearance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Choose your preferred theme
          </p>
          {mounted &&
          <div className="flex gap-3">
              {[
            { value: "light", icon: Sun, label: "Light" },
            { value: "dark", icon: Moon, label: "Dark" },
            { value: "system", icon: Monitor, label: "System" }].
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

      {}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Phone className="h-5 w-5" />
            SMS Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add your phone number to receive SMS alerts for budget warnings,
            monthly reports, and transaction updates.
          </p>
          <div>
            <Input
              type="tel"
              placeholder="+919876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)} />
            
            <p className="text-xs text-muted-foreground mt-1">
              International format with country code (e.g. +91 for India)
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            {hasPhone &&
            <Button
              variant="outline"
              onClick={handleTestSMS}
              disabled={testing}>
              
                {testing ? "Sending..." : "Send Test SMS"}
              </Button>
            }
            {phone &&
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-700"
              onClick={() => {
                setPhone("");
                updatePhoneNumber("").then((result) => {
                  if (result.success) {
                    toast.success("Phone number removed.");
                    setHasPhone(false);
                  }
                });
              }}>
              
                Remove
              </Button>
            }
          </div>
        </CardContent>
      </Card>

      {}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-lg">Manage Accounts</CardTitle>
          <CreateAccountDrawer>
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              Add Account
            </Button>
          </CreateAccountDrawer>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ?
          <p className="text-sm text-muted-foreground">
              No accounts found.
            </p> :

          <div className="space-y-3">
              {accounts.map((account) =>
            <div
              key={account.id}
              className="flex items-center justify-between p-3 rounded-lg border">
              
                  <div>
                    <p className="font-medium capitalize">
                      {account.name}
                      {account.isDefault &&
                  <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
                          Default
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
                      <span className="text-xs text-muted-foreground">Default</span>
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
            Contact Us
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            Have questions, feedback, or need help? Reach out to us.
          </p>
          <div className="space-y-1 text-sm">
            <p>
              Email:{" "}
              <a
                href="mailto:support@gullak.app"
                className="text-orange-600 hover:underline">
                
                support@gullak.app
              </a>
            </p>
            <p className="text-muted-foreground">
              We typically respond within 24 hours.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>);

}
