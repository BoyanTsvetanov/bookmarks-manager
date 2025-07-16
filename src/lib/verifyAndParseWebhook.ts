import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { WebhookEvent } from "@clerk/nextjs/server";

const isDev = process.env.NODE_ENV === "development";

export async function verifyClerkWebhook(req: NextRequest): Promise<WebhookEvent> {
  const body = await req.text();

  if (isDev) {
    try {
      const json = JSON.parse(body);
      return json as WebhookEvent;
    } catch (e) {
      throw new Error("Invalid dev payload");
    }
  }

  try {
    return await verifyWebhook(req);
  } catch (err) {
    console.error("❌ Clerk webhook verification failed:", err);
    throw new Error("Invalid webhook");
  }
}
