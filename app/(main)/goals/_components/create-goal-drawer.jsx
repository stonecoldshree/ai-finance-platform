"use client";

import { useState } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose, DrawerFooter } from "@/components/ui/drawer";
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
      toast.success("Goal created successfully!");
      setOpen(false);
      setFormData({ name: "", targetAmount: "", targetDate: "", color: "#ea580c" });
    } else {
      toast.error(res.error || "Failed to create goal");
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{t("goals.createGoal")}</DrawerTitle>
          <p className="text-sm text-muted-foreground">{t("goals.createGoalDesc")}</p>
        </DrawerHeader>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("goals.goalName")}</Label>
            <Input
              id="name"
              placeholder="e.g. New Macbook"
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
              placeholder="100000"
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
              <span className="text-xs text-muted-foreground">Select a theme color for this goal</span>
            </div>
          </div>
          <DrawerFooter className="px-0">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4 mr-2" />}
              {t("goals.createGoal")}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">{t("goals.cancel")}</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
