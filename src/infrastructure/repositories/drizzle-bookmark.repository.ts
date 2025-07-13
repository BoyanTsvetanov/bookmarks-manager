import { db } from "@/infrastructure/db/drizzle";
import { bookmarksTable, bookmarkInsertSchema, bookmarkSelectSchema } from "@/infrastructure/db/schema";
import { Bookmark } from "@/domain/bookmark/bookmark.entity";
import { BookmarkRepository, CreateBookmarkInput } from "@/domain/bookmark/bookmark.repository";
import { z } from "zod";
import { eq } from "drizzle-orm";


export class DrizzleBookmarkRepository implements BookmarkRepository {
  async create(bookmark: CreateBookmarkInput): Promise<Bookmark> {
    const parsedData = bookmarkInsertSchema.parse(bookmark);

    const result = await db.insert(bookmarksTable).values(parsedData).returning();
    
    const bookmarkFromDB = bookmarkSelectSchema.parse(result[0]);
    return new Bookmark({
      id: bookmarkFromDB.id,
      url: bookmarkFromDB.url,
      title: bookmarkFromDB.title,
      description: bookmarkFromDB.description ?? undefined,
      tags: bookmarkFromDB.tags,
      createdAt: bookmarkFromDB.createdAt,
      userId: bookmarkFromDB.userId,
    });
  }

  async findById(id: string): Promise<Bookmark | null> {
    const result = await db.select().from(bookmarksTable).where(eq(bookmarksTable.id, id)).limit(1);
    
    if (result.length === 0) return null;
    
    const bookmarkFromDB = bookmarkSelectSchema.parse(result[0]);
    return new Bookmark({
      id: bookmarkFromDB.id,
      url: bookmarkFromDB.url,
      title: bookmarkFromDB.title,
      description: bookmarkFromDB.description ?? undefined,
      tags: bookmarkFromDB.tags,
      createdAt: bookmarkFromDB.createdAt,
      userId: bookmarkFromDB.userId,
    });
  }

  async findAll(): Promise<Bookmark[]> {
    const results = await db.select().from(bookmarksTable);
    return results.map((result) => {
      const bookmarkFromDB = bookmarkSelectSchema.parse(result);
      return new Bookmark({
        id: bookmarkFromDB.id,
        url: bookmarkFromDB.url,
        title: bookmarkFromDB.title,
        description: bookmarkFromDB.description ?? undefined,
        tags: bookmarkFromDB.tags,
        createdAt: bookmarkFromDB.createdAt,
        userId: bookmarkFromDB.userId,
      });
    });
  }

  async findByUserId(userId: string) {
  const result = await db.select().from(bookmarksTable).where(eq(bookmarksTable.userId, userId));
  return result;
}

  async update(id: string, data: Partial<CreateBookmarkInput>): Promise<Bookmark> {
  const result = await db
    .update(bookmarksTable)
    .set(data)
    .where(eq(bookmarksTable.id, id))
    .returning();

  if (!result.length) throw new Error("Update failed");

  const bookmarkFromDB = bookmarkSelectSchema.parse(result[0]);
  return new Bookmark({
    id: bookmarkFromDB.id,
    url: bookmarkFromDB.url,
    title: bookmarkFromDB.title,
    description: bookmarkFromDB.description ?? undefined,
    tags: bookmarkFromDB.tags,
    createdAt: bookmarkFromDB.createdAt,
    userId: bookmarkFromDB.userId,
  });
}


  async delete(id: string): Promise<void> {
    await db.delete(bookmarksTable).where(eq(bookmarksTable.id, id));
  }
}
