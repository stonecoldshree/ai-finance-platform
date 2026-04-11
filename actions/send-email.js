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

function normalizeEmailError(error) {
  if (!error) return "Unknown EmailJS error";
  if (typeof error === "string") return error;

  const fromText = error.text || error.responseText;
  const fromMessage = error.message || error.statusText;
  const fromBody = error.response?.data?.message || error.data?.message;

  return fromText || fromBody || fromMessage || "EmailJS request failed";
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
    const fallbackName = templateParams.name || deriveNameFromEmail(primaryRecipient);
    const fallbackTitle = templateParams.title || subject || "Gullak Notification";
    const fallbackAlertMessage = templateParams.alert_message || messageText || subject || "You have a new notification from Gullak.";

    const mergedTemplateParams = {
      email: primaryRecipient,
      to_email: primaryRecipient,
      to: primaryRecipient,
      recipient_email: primaryRecipient,
      name: fallbackName,
      to_name: templateParams.to_name || fallbackName,
      userName: templateParams.userName || fallbackName,
      user_name: templateParams.user_name || fallbackName,
      title: fallbackTitle,
      alert_title: templateParams.alert_title || fallbackTitle,
      subject,
      alert_message: fallbackAlertMessage,
      amount: templateParams.amount ?? "",
      category: templateParams.category ?? "",
      description: templateParams.description ?? "",
      advice1: templateParams.advice1 ?? "",
      advice2: templateParams.advice2 ?? "",
      advice3: templateParams.advice3 ?? "",
      company_name: process.env.COMPANY_NAME || "Gullak",
      website_link: templateParams.website_link || normalizedAppUrl,
      dashboard_link: templateParams.dashboard_link || `${normalizedAppUrl}/dashboard`,
      message_html: messageHtml,
      message_text: messageText,
      ...templateParams
    };

    const data = await emailjs.send(serviceId, templateId, mergedTemplateParams, {
      publicKey,
      privateKey
    });

    return { success: true, data };
  } catch (error) {
    const normalizedError = normalizeEmailError(error);
    console.error("Failed to send email:", normalizedError, error);
    return { success: false, error: normalizedError };
  }
}
