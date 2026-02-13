"use server";

import { sendEmail } from "./send-email";
import { currentUser } from "@clerk/nextjs/server";

export async function sendTestEmail() {
    try {
        const user = await currentUser();

        if (!user) {
            throw new Error("User not found");
        }

        const email = user.emailAddresses[0].emailAddress;

        const result = await sendEmail({
            to: email,
            subject: "Gullak Test Email",
            react: (
                <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
                    <h1>Test Email from Gullak</h1>
                    <p>Hello {user.firstName || "User"},</p>
                    <p>This is a test email to verify that your email configuration is working correctly.</p>
                    <p>If you received this, the Resend integration is active.</p>
                </div>
            ),
        });

        if (!result.success) {
            throw new Error(JSON.stringify(result.error));
        }

        return { success: true, email };
    } catch (error) {
        console.error("Test email failed:", error);
        return { success: false, error: error.message };
    }
}
