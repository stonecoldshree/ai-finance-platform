"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/components/language-provider";

export default function PhonePromptBanner({ hasPhone, isExistingUser }) {
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("phone-prompt-dismissed");
    if (wasDismissed) setDismissed(true);
  }, []);

  useEffect(() => {
    setOpen(Boolean(isExistingUser && !hasPhone && !dismissed));
  }, [hasPhone, isExistingUser, dismissed]);

  if (hasPhone || dismissed || !isExistingUser) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("phone-prompt-dismissed", "true");
    setDismissed(true);
    setOpen(false);
  };

  const handleAddPhone = () => {
    setOpen(false);
    router.push("/settings");
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("phonePromptPopup.title", {}, "You have not entered your phone number")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("phonePromptPopup.description", {}, "Add your phone number to receive SMS alerts for budget warnings, reports, and transaction updates.")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button variant="outline" onClick={handleDismiss}>
            {t("phonePromptPopup.later", {}, "Later")}
          </Button>
          <Button onClick={handleAddPhone}>
            {t("phoneBanner.addPhone")}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
