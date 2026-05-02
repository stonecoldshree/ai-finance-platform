"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export default function Error({ error, reset }) {
  const { t } = useLanguage();

  useEffect(() => {
    
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100/50 dark:bg-red-900/20">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("errorPage.title")}</h1>
          <p className="text-muted-foreground">
            {t("errorPage.description")}
          </p>
        </div>
        <div className="flex space-x-4">
          <Button onClick={() => reset()} variant="default">
            {t("errorPage.tryAgain")}
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            {t("errorPage.returnDashboard")}
          </Button>
        </div>
      </div>
    </div>
  );
}
