import { and, eq, inArray, lte } from "drizzle-orm";
import { db } from "src/db/client";
import { sessions } from "src/db/schema/sessions";

export const sweepCredentials = async (userId: string, limit: number) => {
  const conditions = [lte(sessions.expiresAt, new Date())];

  if (userId) {
    conditions.push(eq(sessions.userId, userId));
  }

  const sessionsToDelete = await db
    .select({ id: sessions.id })
    .from(sessions)
    .where(and(...conditions))
    .limit(limit);

  if (sessionsToDelete.length === 0) {
    return;
  }

  const idsToDelete = sessionsToDelete.map((s) => s.id);

  return await db.delete(sessions).where(inArray(sessions.id, idsToDelete));
};
