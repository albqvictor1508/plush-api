import { eq } from "drizzle-orm";
import type { UserMetadata } from "src/@types";
import { redis } from "src/common/cache";
import { Snowflake } from "src/common/snowflake";
import { generateAccessToken, generateRefreshToken } from "src/config/auth";
import { db } from "src/db/client";
import { sessions } from "src/db/schema/sessions";
import { users } from "src/db/schema/users";

interface SignupOptions {
  authId: string;
  email: string;
  password: string;
  avatar: string;
  name: string;
  meta: UserMetadata;
}

export const signup = async ({
  email,
  avatar,
  name,
  password,
  authId,
  meta,
}: SignupOptions) => {
  const TWO_MIN_IN_SECS = "120";
  const { browser, ip, os } = meta;
  try {
    const isEmailUsed = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, email));
    if (isEmailUsed) throw new Error("tratar erro"); //WARN: tratar erro

    const isNameUsed = await db
      .select({ name: users.name })
      .from(users)
      .where(eq(users.name, name));
    if (isNameUsed) throw new Error("tratar erro"); //WARN: tratar erro

    const [user] = await db
      .insert(users)
      .values({
        id: (await new Snowflake().create()).toString(),
        email,
        name,
        password,
        authId,
        avatar,
      })
      .returning();
    if (!user) throw new Error("tratar erro"); //WARN: tratar erro

    await redis.send("SETEX", [
      `users:${user.id}`,
      TWO_MIN_IN_SECS,
      JSON.stringify(user),
    ]);

    const { hash, token } = generateRefreshToken();

    const FIFTEEN_DAYS_LATER = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

    await db.insert(sessions).values({
      hash,
      expiresAt: FIFTEEN_DAYS_LATER,
      userId: user.id,
      browser,
      ip,
      os,
    });

    return {
      refresh: token,
      access: await generateAccessToken(user),
    };
  } catch (error: any) {
    if (error.code === "23505") {
      if (error.detail.includes("email"))
        throw new Error("Este e-mail já está em uso");

      if (error.detail.includes("name"))
        throw new Error("Este e-mail já está em uso");

      throw new Error(" E-mail ou Nome já está em uso");
    }

    throw error;
  }
};
