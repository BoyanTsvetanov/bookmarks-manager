import { container } from "@/di/container";
import { TOKENS } from "@/di/tokens";
import { CreateBookmarkUseCase } from "@/application/bookmark/use-cases/create-bookmark.use-case";
import { DrizzleBookmarkRepository } from "@/infrastructure/repositories/drizzle-bookmark.repository";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

const createBookmarkSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = createBookmarkSchema.parse(body);

    const useCase = container.get(TOKENS.createBookmark) as CreateBookmarkUseCase;
    const bookmark = await useCase.execute({ ...parsed, userId });

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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const repo = container.get(TOKENS.bookmarkRepo) as DrizzleBookmarkRepository;
    const bookmarks = await repo.findByUserId(userId); // 👈 we'll implement this next

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error("Fetching bookmarks failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
