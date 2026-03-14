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

const INTERVALS = ["DAILY", "WEEKLY", "MONTHLY", "YEARLY"];

function formatIntervalLabel(interval) {
  if (!interval) return "Monthly";
  return interval.charAt(0) + interval.slice(1).toLowerCase();
}

function getStatusLabel(status) {
  return status === "COMPLETED" ? "Active" : "Paused";
}

export default function RecurringTransactionsClient({ initialItems = [] }) {
  const [items, setItems] = useState(initialItems);
  const [loadingId, setLoadingId] = useState(null);

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
      toast.success("Recurring transaction paused");
      await refresh();
    } catch (error) {
      toast.error(error.message || "Failed to pause recurring transaction");
    } finally {
      setLoadingId(null);
    }
  };

  const handleResume = async (id) => {
    setLoadingId(id);
    try {
      await resumeRecurringTransaction(id);
      toast.success("Recurring transaction resumed");
      await refresh();
    } catch (error) {
      toast.error(error.message || "Failed to resume recurring transaction");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDisable = async (id) => {
    setLoadingId(id);
    try {
      await disableRecurringTransaction(id);
      toast.success("Recurring template removed");
      await refresh();
    } catch (error) {
      toast.error(error.message || "Failed to disable recurring transaction");
    } finally {
      setLoadingId(null);
    }
  };

  const handleIntervalChange = async (id, interval) => {
    setLoadingId(id);
    try {
      await updateRecurringInterval(id, interval);
      toast.success("Recurring interval updated");
      await refresh();
    } catch (error) {
      toast.error(error.message || "Failed to update interval");
    } finally {
      setLoadingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="border-orange-200/60 bg-orange-50/40 dark:border-orange-900/40 dark:bg-orange-950/10">
        <CardContent className="space-y-4 py-10 text-center text-sm text-muted-foreground">
          <p>No recurring templates yet. Enable recurring when adding a transaction.</p>
          <Link href="/transaction/create" className="inline-flex">
            <Button size="sm">Create Recurring Template</Button>
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
                {item.description || "Recurring Template"}
              </CardTitle>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full border px-2 py-1 text-muted-foreground">{item.type}</span>
                <span className="rounded-full border px-2 py-1 text-muted-foreground">{item.account?.name || "N/A"}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 text-sm md:grid-cols-4">
              <p>
                <span className="text-muted-foreground">Amount:</span> ₹{Number(item.amount).toFixed(2)}
              </p>
              <p>
                <span className="text-muted-foreground">Type:</span> {item.type}
              </p>
              <p>
                <span className="text-muted-foreground">Account:</span> {item.account?.name || "N/A"}
              </p>
              <p>
                <span className="text-muted-foreground">Status:</span> {getStatusLabel(item.status)}
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3 md:items-center">
              <div>
                <p className="mb-1 text-xs text-muted-foreground">Recurring Interval</p>
                <Select
                  value={item.recurringInterval || "MONTHLY"}
                  onValueChange={(value) => handleIntervalChange(item.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Interval" />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERVALS.map((interval) => (
                      <SelectItem key={interval} value={interval}>
                        {formatIntervalLabel(interval)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <p className="text-xs text-muted-foreground">
                Next run: {item.nextRecurringDate ? new Date(item.nextRecurringDate).toLocaleDateString() : "Not scheduled"}
              </p>

              <div className="flex flex-wrap gap-2 md:justify-end">
                {item.status === "COMPLETED" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePause(item.id)}
                    disabled={loadingId === item.id}>
                    <PauseCircle className="mr-1 h-4 w-4" /> Pause
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResume(item.id)}
                    disabled={loadingId === item.id}>
                    <PlayCircle className="mr-1 h-4 w-4" /> Resume
                  </Button>
                )}

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDisable(item.id)}
                  disabled={loadingId === item.id}>
                  <Trash2 className="mr-1 h-4 w-4" /> Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
