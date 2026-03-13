"use server";

import { sendSMS } from "./send-sms";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function sendTestSMS() {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId }
    });

    if (!user) throw new Error("User not found");

    if (!user.phoneNumber) {
      return {
        success: false,
        error: "No phone number found. Please add one in Settings."
      };
    }

    const result = await sendSMS({
      to: user.phoneNumber,
      body: `Test SMS from Gullak! Hello ${user.name || "User"}, your SMS configuration is working correctly. 🎉`
    });

    if (!result.success) {
      throw new Error(result.error);
    }

    return { success: true, phoneNumber: user.phoneNumber };
  } catch (error) {
    console.error("Test SMS failed:", error);
    return { success: false, error: error.message };
  }
}
