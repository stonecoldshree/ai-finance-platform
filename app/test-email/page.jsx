"use client";

import { sendTestEmail } from "@/actions/test-send-email";
import { sendTestSMS } from "@/actions/test-send-sms";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function TestEmailPage() {
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingSMS, setLoadingSMS] = useState(false);

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

  const handleSendTestSMS = async () => {
    setLoadingSMS(true);
    try {
      const result = await sendTestSMS();
      if (result.success) {
        toast.success(`Test SMS sent to ${result.phoneNumber}`);
      } else {
        toast.error(`Failed to send SMS: ${result.error}`);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoadingSMS(false);
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

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">SMS Test</h2>
                    <p className="mb-6 text-gray-600">
                        Send a test SMS to your phone number from Clerk profile.
                    </p>
                    <Button
            onClick={handleSendTestSMS}
            disabled={loadingSMS}
            className="w-full"
            variant="outline">
            
                        {loadingSMS ? "Sending..." : "Send Test SMS"}
                    </Button>
                </div>
            </div>
        </div>);

}
