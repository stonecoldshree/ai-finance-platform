"use client";

import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center space-y-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100/50 dark:bg-blue-900/20">
          <Compass className="h-10 w-10 text-blue-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <p className="text-muted-foreground">
            Oops! The page you're looking for seems to have wandered off.
            Let's get you back to your finances.
          </p>
        </div>
        <Link href="/">
          <Button variant="default" size="lg">
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}
