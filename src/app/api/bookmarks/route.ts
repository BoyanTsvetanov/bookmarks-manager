import { container } from "@/container";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";

const createBookmarkSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createBookmarkSchema.parse(body);

    const bookmark = await container.createBookmarkUseCase.execute(parsed);

    return NextResponse.json(bookmark);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", issues: error.errors },
        { status: 400 }
      );
    }

    console.error("Bookmark creation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const bookmarks = await container.bookmarkRepository.findAll();
    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
