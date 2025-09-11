import { eq } from "drizzle-orm";
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from "src/config/auth";
import { db } from "src/db/client";
import { sessions } from "src/db/schema/sessions";
import { users } from "src/db/schema/users";

export const refresh = async (token?: string) => {
  if (!token) throw new Error("tratar erro"); //validar erro

  const hashed = hashRefreshToken(token);

  const [session] = await db
    .select({
      userId: sessions.userId,
      expiresAt: sessions.expiresAt,
      hash: sessions.hash,
    })
    .from(sessions)
    .where(eq(sessions.hash, hashed));

  if (!session || session.expiresAt < new Date()) {
    if (session)
      await db.delete(sessions).where(eq(sessions.hash, session.hash));

    throw new Error("tratar erro"); //TODO: tratar erro
  }

  const [user] = await db
    .select({ email: users.email, id: users.id })
    .from(users)
    .where(eq(users.id, session.userId));

  if (!user) throw new Error("tratar erro"); //TODO: tratar erro

  const { hash, token: refreshed } = generateRefreshToken();
  const SEVEN_DAYS_LATER = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await db
    .update(sessions)
    .set({
      hash,
      expiresAt: SEVEN_DAYS_LATER,
    })
    .where(eq(sessions.hash, hashed));

  return {
    refreshed,
    user,
    access: await generateAccessToken(user),
  };
};
