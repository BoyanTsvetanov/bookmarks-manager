import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
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

export const usersTable = pgTable('users', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  username: text('username').notNull(),
  role: text('role').default('user').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull().$onUpdate(() => new Date()),
});

export const bookmarkInsertSchema = createInsertSchema(bookmarksTable);
export const bookmarkSelectSchema = createSelectSchema(bookmarksTable);

export type BookmarkInsert = typeof bookmarkInsertSchema.type;
export type BookmarkFromDB = typeof bookmarkSelectSchema.type;

export const userInsertSchema = createInsertSchema(usersTable);
export const userSelectSchema = createSelectSchema(usersTable);

export type UserInsert = typeof userInsertSchema.type;
export type UserFromDB = typeof userSelectSchema.type;
