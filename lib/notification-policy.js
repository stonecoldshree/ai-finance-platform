const EVENT_POLICIES = {
  "transaction-success": {
    email: true,
    sms: true
  },
  "monthly-report": {
    email: true,
    sms: false
  },
  "budget-coach": {
    email: true,
    sms: false
  },
  "budget-alert": {
    email: true,
    sms: true
  },
  "critical-alert": {
    email: true,
    sms: true
  }
};

function readBoolean(value, fallback = false) {
  if (value === undefined) return fallback;
  return String(value).toLowerCase() === "true";
}

export function shouldSendEmail(eventType) {
  const policy = EVENT_POLICIES[eventType] || { email: true, sms: false };
  if (!policy.email) return false;
  return readBoolean(process.env.ENABLE_EMAIL_NOTIFICATIONS, true);
}

export function shouldSendSMS(eventType, hasPhoneNumber = false) {
  if (!hasPhoneNumber) return false;

  const policy = EVENT_POLICIES[eventType] || { email: true, sms: false };
  if (!policy.sms) return false;

  const smsEnabled = readBoolean(process.env.ENABLE_SMS_NOTIFICATIONS, true);
  const criticalOnly = readBoolean(process.env.SMS_CRITICAL_ONLY, false);

  if (!smsEnabled) return false;
  if (!criticalOnly) return true;

  return (
    eventType === "budget-alert" ||
    eventType === "critical-alert" ||
    eventType === "transaction-success"
  );
}
