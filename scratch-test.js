import twilio from "twilio";

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

async function test() {
  try {
    const message = await client.messages.create({
      body: "Test message from Gullak AI!",
      from: "whatsapp:+14155238886",
      to: "whatsapp:+917061124893"
    });
    console.log("Success! SID:", message.sid);
  } catch (error) {
    console.error("Twilio Error:", error.message, error.code);
  }
}

test();
