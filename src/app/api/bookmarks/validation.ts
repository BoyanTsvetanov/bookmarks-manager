import { z } from "zod";

export const createBookmarkSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const updateBookmarkSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).optional(),
  url: z.string().url().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});
