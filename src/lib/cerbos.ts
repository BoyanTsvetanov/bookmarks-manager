// lib/cerbos.ts
import { HTTP } from "@cerbos/http";

export const cerbos = new HTTP("http://localhost:3592");

export async function canUserDeleteBookmark({
  userId,
  userRole,
  bookmarkId,
  bookmarkOwnerId,
}: {
  userId: string;
  userRole: string;
  bookmarkId: string;
  bookmarkOwnerId: string;
}) {
  const decision = await cerbos.checkResource({
    principal: {
      id: userId,
      roles: [userRole],
      attr: {},
    },
    resource: {
      kind: "bookmark",
      id: bookmarkId,
      attr: {
        ownerId: bookmarkOwnerId,
      },
    },
    actions: ["delete"],
  });

  return decision.isAllowed("delete");
}
