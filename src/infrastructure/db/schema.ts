import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const bookmarksTable = pgTable("bookmarks", {
  id: uuid("id").primaryKey().defaultRandom(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  tags: text("tags").array().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  userId: text("user_id").notNull(),
});

export const bookmarkInsertSchema = createInsertSchema(bookmarksTable);
export const bookmarkSelectSchema = createSelectSchema(bookmarksTable);

export type BookmarkInsert = typeof bookmarkInsertSchema.type;
export type BookmarkFromDB = typeof bookmarkSelectSchema.type;
