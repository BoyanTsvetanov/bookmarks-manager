import { container } from "@/di/container";
import { TOKENS } from "@/di/tokens";
import { DrizzleBookmarkRepository } from "@/infrastructure/repositories/drizzle-bookmark.repository";
import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/infrastructure/db/drizzle";
import { bookmarksTable, usersTable } from "@/infrastructure/db/schema";
import { eq } from "drizzle-orm";
import { cerbos } from "@/lib/cerbos";

const idSchema = z.string().uuid();
const updateBookmarkSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

async function getUserRole(userId: string): Promise<string> {
  const [user] = await db
    .select({ role: usersTable.role })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  return user?.role || "user";
}

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = idSchema.parse(context.params.id);
  const role = await getUserRole(userId);

  const repo = container.get(TOKENS.bookmarkRepo) as DrizzleBookmarkRepository;
  const bookmark = await repo.findById(id);

  if (!bookmark) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const canRead = await cerbos.checkResource({
    principal: {
      id: userId,
      roles: [role],
      attr: {},
    },
    resource: {
      kind: "bookmark",
      id: bookmark.id,
      attr: {
        ownerId: bookmark.userId,
      },
    },
    actions: ["read"],
  });

  if (!canRead.isAllowed("read")) {
    return NextResponse.json({ error: "Forbidden by Cerbos" }, { status: 403 });
  }

  return NextResponse.json(bookmark);
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = idSchema.parse(context.params.id);
  const data = updateBookmarkSchema.parse(await req.json());
  const role = await getUserRole(userId);

  const repo = container.get(TOKENS.bookmarkRepo) as DrizzleBookmarkRepository;
  const bookmark = await repo.findById(id);

  if (!bookmark) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const canEdit = await cerbos.checkResource({
    principal: {
      id: userId,
      roles: [role],
      attr: {},
    },
    resource: {
      kind: "bookmark",
      id: bookmark.id,
      attr: {
        ownerId: bookmark.userId,
      },
    },
    actions: ["edit"],
  });

  if (!canEdit.isAllowed("edit")) {
    return NextResponse.json({ error: "Forbidden by Cerbos" }, { status: 403 });
  }

  const updated = await repo.update(id, data);
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = idSchema.parse(context.params.id);
  const role = await getUserRole(userId);

  const [bookmark] = await db
    .select()
    .from(bookmarksTable)
    .where(eq(bookmarksTable.id, id));

  if (!bookmark) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const canDelete = await cerbos.checkResource({
    principal: {
      id: userId,
      roles: [role],
      attr: {},
    },
    resource: {
      kind: "bookmark",
      id: bookmark.id,
      attr: {
        ownerId: bookmark.userId,
      },
    },
    actions: ["delete"],
  });

  if (!canDelete.isAllowed("delete")) {
    return NextResponse.json({ error: "Forbidden by Cerbos" }, { status: 403 });
  }

  await db.delete(bookmarksTable).where(eq(bookmarksTable.id, id));
  return NextResponse.json({ message: "Deleted" }, { status: 200 });
}
