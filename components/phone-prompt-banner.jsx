"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function PhonePromptBanner({ hasPhone }) {
  const [dismissed, setDismissed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const wasDismissed = sessionStorage.getItem("phone-prompt-dismissed");
    if (wasDismissed) setDismissed(true);
  }, []);

  if (hasPhone || dismissed) return null;

  const handleDismiss = () => {
    sessionStorage.setItem("phone-prompt-dismissed", "true");
    setDismissed(true);
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-orange-800">
          📱 Enable SMS Notifications
        </p>
        <p className="text-sm text-orange-600 mt-1">
          Add your phone number to receive budget alerts, monthly reports, and
          transaction updates via SMS.
        </p>
      </div>
      <div className="flex items-center gap-2 ml-4">
        <Button
          size="sm"
          onClick={() => router.push("/settings")}
        >
          Add Phone Number
        </Button>
        <button
          onClick={handleDismiss}
          className="text-orange-400 hover:text-orange-600 p-1"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
