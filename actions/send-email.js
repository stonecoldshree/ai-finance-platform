"use server";

import { Resend } from "resend";

export async function sendEmail({ to, subject, react }) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "Missing RESEND_API_KEY" };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const fromAddress = process.env.EMAIL_FROM_ADDRESS || "Finance App <onboarding@resend.dev>";

  try {
    const data = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      react
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
