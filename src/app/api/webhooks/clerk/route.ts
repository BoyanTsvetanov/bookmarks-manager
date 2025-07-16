import { NextRequest, NextResponse } from "next/server";
import { CreateUserUseCase } from "@/application/user/use-cases/create-user.use-case";
import { DrizzleUserRepository } from "@/infrastructure/repositories/drizzle-user.repository";
import { verifyClerkWebhook } from "@/lib/verifyAndParseWebhook";
import { parseClerkUser } from "@/lib/parseClerkUser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const event = await verifyClerkWebhook(req);

    if (event.type === "user.created") {
      const userData = parseClerkUser(event.data);

      const userRepository = new DrizzleUserRepository();
      const createUser = new CreateUserUseCase(userRepository);

      await createUser.execute({
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: "user",
      });

      return new NextResponse("✅ User created", { status: 200 });
    }

    return new NextResponse("⚠️ Event ignored", { status: 200 });
  } catch (err) {
    return new NextResponse("❌ Webhook error", { status: 400 });
  }
}
