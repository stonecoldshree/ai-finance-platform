"use client";

import { sendTestEmail } from "@/actions/test-send-email";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function TestEmailPage() {
  const [loadingEmail, setLoadingEmail] = useState(false);

  const handleSendTest = async () => {
    setLoadingEmail(true);
    try {
      const result = await sendTestEmail();
      if (result.success) {
        toast.success(`Test email sent to ${result.email}`);
      } else {
        toast.error(`Failed to send email: ${result.error}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoadingEmail(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20">
            <h1 className="text-3xl font-bold mb-8">Notification Configuration Test</h1>

            <div className="grid gap-6 max-w-md">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">Email Test</h2>
                    <p className="mb-6 text-gray-600">
                        Send a test email to your registered email address.
                    </p>
                    <Button
            onClick={handleSendTest}
            disabled={loadingEmail}
            className="w-full">
            
                        {loadingEmail ? "Sending..." : "Send Test Email"}
                    </Button>
                </div>
            </div>
        </div>);

}
