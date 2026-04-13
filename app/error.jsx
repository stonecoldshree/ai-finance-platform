"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100/50 dark:bg-red-900/20">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Something went wrong</h1>
          <p className="text-muted-foreground">
            We encountered an unexpected error. Our team has been notified.
            Please try reloading the page.
          </p>
        </div>
        <div className="flex space-x-4">
          <Button onClick={() => reset()} variant="default">
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
