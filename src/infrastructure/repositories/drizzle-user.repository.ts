import { UserRepository } from "@/domain/user/user.repository";
import { userInsertSchema, userSelectSchema, usersTable } from "../db/schema";
import { db } from "../db/drizzle";
import { User } from "@/domain/user/user.entity";
import { eq } from "drizzle-orm";
import { z } from "zod";

export class DrizzleUserRepository implements UserRepository {
  async create(input: { username: string; email: string }): Promise<User> {
    const parsedData = userInsertSchema.parse(input);

    const result = await db.insert(usersTable).values(parsedData).returning();
    
    const userFromDB = userSelectSchema.parse(result[0]);
    return new User({
      id: userFromDB.id,
      username: userFromDB.username,
      email: userFromDB.email,
      role: userFromDB.role ?? "user",
      createdAt: userFromDB.createdAt,
      updatedAt: userFromDB.updatedAt,
    });
  }

  async findAll(): Promise<User[]> {
    const results = await db.select().from(usersTable);
    return results.map((result) => {
      const userFromDB = userSelectSchema.parse(result);
      return new User({
        id: userFromDB.id,
        username: userFromDB.username,
        email: userFromDB.email,
        role: userFromDB.role ?? "user",
        createdAt: userFromDB.createdAt,
        updatedAt: userFromDB.updatedAt,
      });
    });
  }

  async findById(id: string): Promise<User | null> {
    const result = await db.select().from(usersTable).where(eq(usersTable.id, id)).limit(1);
    
    if (result.length === 0) return null;
    
    const userFromDB = userSelectSchema.parse(result[0]);
    return new User({
      id: userFromDB.id,
      username: userFromDB.username,
      email: userFromDB.email,
      role: userFromDB.role ?? "user",
      createdAt: userFromDB.createdAt,
      updatedAt: userFromDB.updatedAt,
    });
  }

  async update(id: string, data: Partial<{ username: string; email: string }>): Promise<User> {
    const parsedData = z.object({
      username: z.string().optional(),
      email: z.string().email().optional(),
    }).parse(data);

    const result = await db.update(usersTable).set(parsedData).where(eq(usersTable.id, id)).returning();
    
    if (result.length === 0) throw new Error("User not found");

    const userFromDB = userSelectSchema.parse(result[0]);
    return new User({
      id: userFromDB.id,
      username: userFromDB.username,
      email: userFromDB.email,
      role: userFromDB.role ?? "user",
      createdAt: userFromDB.createdAt,
      updatedAt: userFromDB.updatedAt,
    });
  }

  async delete(id: string): Promise<void> {
      await db.delete(usersTable).where(eq(usersTable.id, id));
    }
  }