"use client";

import { sendTestEmail } from "@/actions/test-send-email";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";

export default function TestEmailPage() {
    const [loading, setLoading] = useState(false);

    const handleSendTest = async () => {
        setLoading(true);
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
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-20">
            <h1 className="text-3xl font-bold mb-8">Email Configuration Test</h1>

            <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
                <p className="mb-6 text-gray-600">
                    Click the button below to send a test email to your registered email address.
                </p>

                <Button
                    onClick={handleSendTest}
                    disabled={loading}
                    className="w-full"
                >
                    {loading ? "Sending..." : "Send Test Email"}
                </Button>
            </div>
        </div>
    );
}
