"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/language-provider";
import { updateGoalFund } from "@/actions/goals";
import { toast } from "sonner";
import { Loader2, PlusCircle } from "lucide-react";

export function AddFundsDialog({ goal, open, onOpenChange }) {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const { t } = useLanguage();

  const handleSave = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;

    setLoading(true);
    const res = await updateGoalFund(goal.id, parseFloat(amount));
    setLoading(false);

    if (res.success) {
      toast.success(`Successfully added ₹${amount} to ${goal.name}`);
      setAmount("");
      onOpenChange(false);
    } else {
      toast.error(res.error || "Failed to add funds");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("goals.addFundsTitle")}</DialogTitle>
          <p className="text-sm text-muted-foreground">{t("goals.amountToAddDesc")}</p>
        </DialogHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("goals.amountToAdd")}</Label>
            <Input
              type="number"
              min="1"
              step="0.01"
              placeholder="e.g. 500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("goals.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <PlusCircle className="h-4 w-4 mr-2" />}
              {t("goals.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
