import { container } from "@/di/container";
import { TOKENS } from "@/di/tokens";
import { DrizzleBookmarkRepository } from "@/infrastructure/repositories/drizzle-bookmark.repository";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/infrastructure/db/drizzle";
import { bookmarksTable } from "@/infrastructure/db/schema";
import { eq } from "drizzle-orm";

const idSchema = z.string().uuid();
const updateBookmarkSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = await idSchema.parse(context.params.id);

    const repo = container.get(TOKENS.bookmarkRepo) as DrizzleBookmarkRepository;
    const bookmark = await repo.findById(id);

    if (!bookmark) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(bookmark);
  } catch (err) {
    console.error("Error fetching bookmark:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [bookmark] = await db
    .select()
    .from(bookmarksTable)
    .where(eq(bookmarksTable.id, params.id));

  if (!bookmark) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (bookmark.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await db.delete(bookmarksTable).where(eq(bookmarksTable.id, params.id));

  return NextResponse.json({ message: "Deleted" }, { status: 200 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = idSchema.parse(params.id);
    const data = updateBookmarkSchema.parse(await req.json());

    const repo = container.get(TOKENS.bookmarkRepo) as DrizzleBookmarkRepository;
    const updated = await repo.update(id, data);

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid input or update failed" }, { status: 400 });
  }
}
