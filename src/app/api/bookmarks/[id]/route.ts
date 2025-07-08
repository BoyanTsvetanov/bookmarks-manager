import { container } from "@/container";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const idSchema = z.string().uuid();

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const id = idSchema.parse(context.params.id);
    const bookmark = await container.bookmarkRepository.findById(id);

    if (!bookmark) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(bookmark);
  } catch (err) {
    console.error("Error fetching bookmark:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = idSchema.parse(params.id);
    await container.bookmarkRepository.delete(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
}

const updateBookmarkSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = idSchema.parse(params.id);
    const data = updateBookmarkSchema.parse(await req.json());

    const updated = await container.bookmarkRepository.update(id, data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Invalid input or update failed" }, { status: 400 });
  }
}
