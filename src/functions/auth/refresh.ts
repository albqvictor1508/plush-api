import { eq } from "drizzle-orm";
import { hashRefreshToken } from "src/common/auth";
import { db } from "src/db/client";
import { sessions } from "src/db/schema/sessions";

export const refresh = async (token: string | null) => {
  if (!token) return "error"; //validar erro

  const hash = hashRefreshToken(token);

  const [session] = await db.select({ userId: sessions.userId, expiresAt: sessions.expiresAt, hash: sessions.hash }).from(sessions).where(eq(sessions.hash, hash))
  if (!session || session.expiresAt > new Date()) {
    if (session) {
      await db.delete(sessions).where(eq(sessions.hash, session.hash))
      return;
    }
  }
};
