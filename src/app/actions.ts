"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/infrastructure/db/drizzle";
import { bookmarksTable } from "@/infrastructure/db/schema";

const bookmarkSchema = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  description: z.string().optional(),
  tags: z.array(z.string()),
});

export async function createBookmark(data: unknown) {
  const parsed = bookmarkSchema.safeParse(data);

  if (!parsed.success) {
    throw new Error("Invalid input");
  }

  const { url, title, description, tags } = parsed.data;

  await db.insert(bookmarksTable).values({
    url,
    title,
    description,
    tags,
  });

  revalidatePath("/bookmarks");
}
