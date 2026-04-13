"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/language-provider";
import { createGoal } from "@/actions/goals";
import { toast } from "sonner";
import { Target, Loader2 } from "lucide-react";

export function CreateGoalDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    targetDate: "",
    color: "#ea580c"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.targetAmount) return;

    setLoading(true);
    const res = await createGoal({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount)
    });
    setLoading(false);

    if (res.success) {
      toast.success(t("goals.createdSuccess", {}, "Goal created successfully!"));
      setOpen(false);
      setFormData({ name: "", targetAmount: "", targetDate: "", color: "#ea580c" });
    } else {
      toast.error(res.error || t("goals.failedAction", {}, "Failed to create goal"));
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>{t("goals.createGoal")}</AlertDialogTitle>
          <AlertDialogDescription>{t("goals.createGoalDesc")}</AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("goals.goalName")}</Label>
            <Input
              id="name"
              placeholder={t("goals.goalNamePlaceholder", {}, "e.g. New Macbook")}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAmount">{t("goals.targetAmount")}</Label>
            <Input
              id="targetAmount"
              type="number"
              min="1"
              step="0.01"
              placeholder={t("goals.targetAmountPlaceholder", {}, "100000")}
              value={formData.targetAmount}
              onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetDate">{t("goals.targetDate")}</Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">{t("goals.color")}</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="color"
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-14 h-10 p-1"
              />
              <span className="text-xs text-muted-foreground">
                {t("goals.selectThemeColor", {}, "Select a theme color for this goal")}
              </span>
            </div>
          </div>
          <AlertDialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4 mr-2" />}
              {t("goals.createGoal")}
            </Button>
            <AlertDialogCancel asChild>
              <Button variant="outline" className="w-full sm:w-auto">{t("goals.cancel")}</Button>
            </AlertDialogCancel>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
