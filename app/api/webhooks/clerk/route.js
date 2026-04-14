import { Webhook } from "svix";
import { db } from "@/lib/prisma";

export async function POST(req) {
  const signingSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!signingSecret) {
    return new Response("Missing CLERK_WEBHOOK_SIGNING_SECRET", { status: 500 });
  }

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new Response("Missing Svix headers", { status: 400 });
  }

  const payload = await req.text();

  let event;
  try {
    const wh = new Webhook(signingSecret);
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature
    });
  } catch (error) {
    console.error("Invalid Clerk webhook signature:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  try {
    if (event.type === "user.deleted") {
      const clerkUserId = event.data?.id;

      if (clerkUserId) {
        await db.user.deleteMany({
          where: { clerkUserId }
        });
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Clerk webhook processing failed:", error);
    return new Response("Webhook handler failed", { status: 500 });
  }
}
