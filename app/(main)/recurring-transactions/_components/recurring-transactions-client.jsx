"use client";

import { useEffect, useState } from "react";
import { PauseCircle, PlayCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
  disableRecurringTransaction,
  getRecurringTransactions,
  pauseRecurringTransaction,
  resumeRecurringTransaction,
  updateRecurringInterval
} from "@/actions/transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useLanguage } from "@/components/language-provider";

const INTERVALS = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

export default function RecurringTransactionsClient({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [loadingId, setLoadingId] = useState(null);
  const { t } = useLanguage();

  const refresh = async () => {
    const result = await getRecurringTransactions();
    setItems(result?.data || []);
  };

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handlePause = async (id) => {
    setLoadingId(id);
    try {
      await pauseRecurringTransaction(id);
      toast.success(t("recurring.paused"));
      await refresh();
    } catch (error) {
      toast.error(error.message || t("recurring.failedPause"));
    } finally {
      setLoadingId(null);
    }
  };

  const handleResume = async (id) => {
    setLoadingId(id);
    try {
      await resumeRecurringTransaction(id);
      toast.success(t("recurring.resumed"));
      await refresh();
    } catch (error) {
      toast.error(error.message || t("recurring.failedResume"));
    } finally {
      setLoadingId(null);
    }
  };

  const handleDisable = async (id) => {
    setLoadingId(id);
    try {
      await disableRecurringTransaction(id);
      toast.success(t("recurring.removed"));
      await refresh();
    } catch (error) {
      toast.error(error.message || t("recurring.failedDisable"));
    } finally {
      setLoadingId(null);
    }
  };

  const handleIntervalChange = async (id, interval) => {
    setLoadingId(id);
    try {
      await updateRecurringInterval(id, interval);
      toast.success(t("recurring.intervalUpdated"));
      await refresh();
    } catch (error) {
      toast.error(error.message || t("recurring.failedInterval"));
    } finally {
      setLoadingId(null);
    }
  };

  const getIntervalLabel = (interval) => {
    if (!interval) return t("recurring.monthly");
    const key = `recurring.interval${interval.charAt(0) + interval.slice(1).toLowerCase()}`;
    return t(key, {}, interval.charAt(0) + interval.slice(1).toLowerCase());
  };

  const getStatusLabel = (status) => {
    return status === "COMPLETED" ? t("recurring.statusActive") : t("recurring.statusPaused");
  };

  if (items.length === 0) {
    return (
      <Card className="border-orange-200/60 bg-orange-50/40 dark:border-orange-900/40 dark:bg-orange-950/10">
        <CardContent className="space-y-4 py-10 text-center text-sm">
          <p className="text-muted-foreground">{t("recurring.noTemplates")}</p>
          <p className="mt-2 text-primary font-medium">
            No subscriptions tracked yet. Add your Netflix or gym memberships so you never face a surprise charge!
          </p>
          <Link href="/transaction/create" className="inline-flex mt-4">
            <Button size="sm">{t("recurring.createTemplate")}</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="border-orange-100/70 bg-card/80">
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-base font-semibold">
                {item.description || t("recurring.recurringTemplate")}
              </CardTitle>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full border px-2 py-1 text-muted-foreground">{item.type}</span>
                <span className="rounded-full border px-2 py-1 text-muted-foreground">{item.account?.name || t("recurring.notAvailable")}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm md:grid-cols-4">
              <p>
                <span className="text-muted-foreground">{t("recurring.amountLabel")}</span> ₹{Number(item.amount).toFixed(2)}
              </p>
              <p>
                <span className="text-muted-foreground">{t("recurring.typeLabel")}</span> {item.type}
              </p>
              <p>
                <span className="text-muted-foreground">{t("recurring.accountLabel")}</span> {item.account?.name || t("recurring.notAvailable")}
              </p>
              <p>
                <span className="text-muted-foreground">{t("recurring.statusLabel")}</span> {getStatusLabel(item.status)}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3 md:items-center">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">{t("recurring.recurringInterval")}</p>
                <Select
                  value={item.recurringInterval || "MONTHLY"}
                  onValueChange={(value) => handleIntervalChange(item.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("recurring.recurringInterval")} />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVALS.map((interval) => (
                      <SelectItem key={interval} value={interval}>
                        {getIntervalLabel(interval)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-muted-foreground">
                {t("recurring.nextRun")} {item.nextRecurringDate ? new Date(item.nextRecurringDate).toLocaleDateString() : t("recurring.notScheduled")}
              </p>

              <div className="flex flex-wrap gap-2 md:justify-end">
                {item.status === "COMPLETED" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePause(item.id)}
                    disabled={loadingId === item.id}>
                    <PauseCircle className="mr-1 h-4 w-4" /> {t("recurring.pause")}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResume(item.id)}
                    disabled={loadingId === item.id}>
                    <PlayCircle className="mr-1 h-4 w-4" /> {t("recurring.resume")}
                  </Button>
                )}

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDisable(item.id)}
                  disabled={loadingId === item.id}>
                  <Trash2 className="mr-1 h-4 w-4" /> {t("recurring.remove")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
