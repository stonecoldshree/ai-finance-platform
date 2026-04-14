import twilio from "twilio";

let client = null;

function normalizeE164(value) {
  if (!value || typeof value !== "string") {
    return "";
  }

  const compact = value.replace(/[\s()-]/g, "").trim();
  if (!compact) {
    return "";
  }

  const defaultCountryCode = process.env.DEFAULT_PHONE_COUNTRY_CODE || "+91";

  if (/^\d{10}$/.test(compact)) {
    return `${defaultCountryCode}${compact}`;
  }

  if (/^0\d{10}$/.test(compact)) {
    return `${defaultCountryCode}${compact.slice(1)}`;
  }

  if (compact.startsWith("00")) {
    return `+${compact.slice(2)}`;
  }

  return compact;
}

function isValidE164(value) {
  return /^\+[1-9]\d{6,14}$/.test(value);
}

function getClient() {
  if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
    throw new Error("Missing Twilio credentials");
  }

  if (!client) {
    client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
  }
  return client;
}

export async function sendSMS({ to, body }) {
  if (!to) {
    return { success: false, error: "No phone number provided" };
  }

  if (!process.env.TWILIO_PHONE_NUMBER) {
    return { success: false, error: "Missing TWILIO_PHONE_NUMBER" };
  }

  const normalizedTo = normalizeE164(to);
  const normalizedFrom = normalizeE164(process.env.TWILIO_PHONE_NUMBER);

  if (!isValidE164(normalizedTo)) {
    return {
      success: false,
      error: "Invalid recipient phone format. Use E.164 (e.g. +919876543210)."
    };
  }

  if (!isValidE164(normalizedFrom)) {
    return {
      success: false,
      error: "Invalid TWILIO_PHONE_NUMBER format. Use E.164 in environment settings."
    };
  }

  try {
    const isWhatsApp = process.env.USE_WHATSAPP === "true";
    const prefix = isWhatsApp ? "whatsapp:" : "";
    
    const twilioClient = getClient();
    const message = await twilioClient.messages.create({
      body,
      from: `${prefix}${normalizedFrom}`,
      to: `${prefix}${normalizedTo}`
    });

    return { success: true, data: { sid: message.sid } };
  } catch (error) {
    const details = [error?.code, error?.message].filter(Boolean).join(" - ");
    console.error("Failed to send SMS:", details || error);
    return { success: false, error: details || "Unknown Twilio error" };
  }
}
