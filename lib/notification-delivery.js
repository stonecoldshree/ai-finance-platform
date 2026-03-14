import { sendEmail } from "@/actions/send-email";
import { sendSMS } from "@/lib/twilio";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withTimeout(task, timeoutMs, timeoutMessage) {
  let timeoutHandle;
  try {
    return await Promise.race([
    task(),
    new Promise((_, reject) => {
      timeoutHandle = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
    })]);

  } finally {
    if (timeoutHandle) clearTimeout(timeoutHandle);
  }
}

async function withRetry(task, { attempts = 3, baseDelayMs = 300, timeoutMs = 6000, timeoutMessage = "Notification timed out" } = {}) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await withTimeout(task, timeoutMs, timeoutMessage);
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        const backoff = baseDelayMs * 2 ** (attempt - 1);
        await delay(backoff);
      }
    }
  }

  throw lastError;
}

export async function sendEmailWithRetry(payload, options = {}) {
  return withRetry(async () => {
    const result = await sendEmail(payload);
    if (!result?.success) {
      throw new Error(result?.error?.message || result?.error || "Email delivery failed");
    }
    return result;
  }, {
    attempts: options.attempts || 3,
    baseDelayMs: options.baseDelayMs || 350,
    timeoutMs: options.timeoutMs || 7000,
    timeoutMessage: "Email send timeout"
  });
}

export async function sendSMSWithRetry(payload, options = {}) {
  return withRetry(async () => {
    const result = await sendSMS(payload);
    if (!result?.success) {
      throw new Error(result?.error || "SMS delivery failed");
    }
    return result;
  }, {
    attempts: options.attempts || 2,
    baseDelayMs: options.baseDelayMs || 300,
    timeoutMs: options.timeoutMs || 6000,
    timeoutMessage: "SMS send timeout"
  });
}