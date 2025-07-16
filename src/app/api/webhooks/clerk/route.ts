import { NextRequest, NextResponse } from "next/server";
import { DrizzleUserRepository } from "@/infrastructure/repositories/drizzle-user.repository";
import { CreateUserUseCase } from "@/application/user/use-cases/create-user.use-case";
import { UpdateUserUseCase } from "@/application/user/use-cases/update-user.use-case";
import { DeleteUserUseCase } from "@/application/user/use-cases/delete-user.use-case";
import { parseClerkUser } from "@/lib/parseClerkUser";
import { verifyClerkWebhook } from "@/lib/verifyAndParseWebhook";
import { DrizzleBookmarkRepository } from "@/infrastructure/repositories/drizzle-bookmark.repository";
import { DeleteBookmarksByUser } from "@/application/bookmark/use-cases/delete-user-bookmarks.use-case";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const event = await verifyClerkWebhook(req);

    const userRepo = new DrizzleUserRepository();

    switch (event.type) {
      case "user.created": {
        const userData = parseClerkUser(event.data);
        const createUser = new CreateUserUseCase(userRepo);
        await createUser.execute({
          id: userData.id,
          email: userData.email,
          username: userData.name || userData.username || "",
          role: "user",
        });
        break;
      }

      case "user.updated": {
        const userData = parseClerkUser(event.data);
        const updateUser = new UpdateUserUseCase(userRepo);
        await updateUser.execute(
          userData.id,
          {
            email: userData.email,
            username: userData.name || userData.username || "",
          }
        );
        break;
      }

      case "user.deleted": {
        const userId = event.data.id;
        if (!userId) {
          throw new Error("User ID is missing in the webhook event data.");
        }

        const deleteUser = new DeleteUserUseCase(userRepo);
        await deleteUser.execute(userId);

        const bookmarkRepo = new DrizzleBookmarkRepository();
        const deleteBookmarks = new DeleteBookmarksByUser(bookmarkRepo);
        await deleteBookmarks.execute({ userId });

        break;
      }

      default:
        console.log("🔍 Ignored event type:", event.type);
    }

    return new NextResponse("✅ Webhook processed", { status: 200 });

  } catch (err) {
    console.error("❌ Webhook error:", err);
    return new NextResponse("Webhook error", { status: 400 });
  }
}
