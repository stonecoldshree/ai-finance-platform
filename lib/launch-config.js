const REQUIRED_ENV_KEYS = [
  "DATABASE_URL",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  "CLERK_SECRET_KEY"
];

const OPTIONAL_ENV_KEYS = [
  "GEMINI_API_KEY",
  "RESEND_API_KEY",
  "TWILIO_ACCOUNT_SID",
  "TWILIO_AUTH_TOKEN",
  "TWILIO_PHONE_NUMBER",
  "ARCJET_KEY",
  "EMAIL_FROM_ADDRESS"
];

function toBool(value, fallback) {
  if (value === undefined) return fallback;
  return String(value).toLowerCase() === "true";
}

export function getLaunchConfig() {
  return {
    notifications: {
      emailEnabled: toBool(process.env.ENABLE_EMAIL_NOTIFICATIONS, true),
      smsEnabled: toBool(process.env.ENABLE_SMS_NOTIFICATIONS, true),
      smsCriticalOnly: toBool(process.env.SMS_CRITICAL_ONLY, true)
    },
    ai: {
      realtimeAdviceEnabled: toBool(process.env.ENABLE_REALTIME_AI_ADVICE, false),
      dailyLimit: Number(process.env.GEMINI_DAILY_LIMIT || 250),
      perMinuteLimit: Number(process.env.GEMINI_PER_MINUTE_LIMIT || 20)
    }
  };
}

export function getEnvReadiness() {
  const missingRequired = REQUIRED_ENV_KEYS.filter((key) => !process.env[key]);
  const missingOptional = OPTIONAL_ENV_KEYS.filter((key) => !process.env[key]);

  return {
    isReady: missingRequired.length === 0,
    missingRequired,
    missingOptional,
    requiredChecked: REQUIRED_ENV_KEYS,
    optionalChecked: OPTIONAL_ENV_KEYS
  };
}