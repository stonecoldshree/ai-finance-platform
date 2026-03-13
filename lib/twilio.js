import twilio from "twilio";

let client = null;

function getClient() {
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

  try {
    const twilioClient = getClient();
    const message = await twilioClient.messages.create({
      body,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });

    return { success: true, data: { sid: message.sid } };
  } catch (error) {
    console.error("Failed to send SMS:", error.message);
    return { success: false, error: error.message };
  }
}
