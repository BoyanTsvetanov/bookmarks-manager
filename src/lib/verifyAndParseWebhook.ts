import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server"; // Types included

export async function verifyClerkWebhook(req: NextRequest): Promise<WebhookEvent> {
  try {
    const event = await verifyWebhook(req);
    return event;
  } catch (err) {
    console.error("❌ Clerk webhook verification failed:", err);
    throw new Error("Invalid webhook");
  }
}
