import { container } from "@/di/container";
import { TOKENS } from "@/di/tokens";
import { DrizzleBookmarkRepository } from "@/infrastructure/repositories/drizzle-bookmark.repository";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

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
    const id = idSchema.parse(context.params.id);

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
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = idSchema.parse(params.id);

    const repo = container.get(TOKENS.bookmarkRepo) as DrizzleBookmarkRepository;
    await repo.delete(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
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
