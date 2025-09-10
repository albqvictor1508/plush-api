import { eq } from "drizzle-orm";
import { generateAccessToken, generateRefreshToken } from "src/common/auth";
import { db } from "src/db/client";
import { sessions } from "src/db/schema/sessions";
import { users } from "src/db/schema/users";
import { sweepCredentials } from "./sweep-credentials";
import type { UserMetadata } from "src/types";

interface LoginOptions {
	email: string;
	password: string;
	meta: UserMetadata;
}

export const login = async ({ email, password, meta }: LoginOptions) => {
	const [user] = await db
		.select({ id: users.id, password: users.password })
		.from(users)
		.where(eq(users.email, email));

	if (
		!user ||
		(user.password && !(await Bun.password.verify(password, user.password)))
	)
		throw new Error("tratar"); //WARN: tratar erro

	const MAX_SESSIONS_PER_USER = 10;
	const SEVEN_DAYS_AFTER = new Date(Date.now() + 6.048e8);

	const { hash, token } = generateRefreshToken();
	const { browser, ip, os } = meta;

	const [_, [session]] = await Promise.all([
		sweepCredentials(user.id, MAX_SESSIONS_PER_USER),
		db
			.insert(sessions)
			.values({
				userId: user.id,
				hash,
				browser,
				os,
				ip,
				expiresAt: SEVEN_DAYS_AFTER,
			})
			.returning({ id: sessions.userId }),
	]);

	if (!session) throw new Error("tratar"); //WARN: tratar erro

	return {
		refresh: token,
		access: await generateAccessToken({ id: session.id, email }),
	};
};
