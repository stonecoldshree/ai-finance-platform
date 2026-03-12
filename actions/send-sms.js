"use server";

import { sendSMS as sendSMSLib } from "@/lib/twilio";

export async function sendSMS(params) {
  return sendSMSLib(params);
}
