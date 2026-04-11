"use server";

import emailjs from "@emailjs/nodejs";
import { render } from "@react-email/render";

function deriveNameFromEmail(email) {
  if (!email || typeof email !== "string") return "there";
  const localPart = email.split("@")[0] || "there";
  return localPart
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function htmlToText(html = "") {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function sendEmail({ to, subject, react, templateParams = {} }) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return { success: false, error: "Missing EmailJS configuration" };
  }

  const primaryRecipient = Array.isArray(to) ? to[0] : to;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const normalizedAppUrl = appUrl.replace(/\/$/, "");

  try {
    const renderedHtml = react ? await render(react) : "";
    const messageHtml = templateParams.message_html || renderedHtml;
    const messageText = templateParams.message_text || htmlToText(messageHtml);

    const data = await emailjs.send(serviceId, templateId, {
      to_email: primaryRecipient,
      name: templateParams.name || deriveNameFromEmail(primaryRecipient),
      title: templateParams.title || subject,
      subject,
      company_name: process.env.COMPANY_NAME || "Gullak",
      website_link: templateParams.website_link || normalizedAppUrl,
      dashboard_link: templateParams.dashboard_link || `${normalizedAppUrl}/dashboard`,
      message_html: messageHtml,
      message_text: messageText,
      ...templateParams
    }, {
      publicKey,
      privateKey
    });

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error };
  }
}
