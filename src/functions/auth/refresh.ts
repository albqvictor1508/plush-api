import { eq } from "drizzle-orm";
import {
	generateAccessToken,
	generateRefreshToken,
	hashRefreshToken,
} from "src/common/auth";
import { db } from "src/db/client";
import { sessions } from "src/db/schema/sessions";
import { users } from "src/db/schema/users";

export const refresh = async (token: string | null) => {
	if (!token) return "error"; //validar erro

	const hashed = hashRefreshToken(token);

	const [session] = await db
		.select({
			userId: sessions.userId,
			expiresAt: sessions.expiresAt,
			hash: sessions.hash,
		})
		.from(sessions)
		.where(eq(sessions.hash, hashed));

	if (!session || session.expiresAt > new Date()) {
		if (session) {
			await db.delete(sessions).where(eq(sessions.hash, session.hash));
		}

		return "Error"; //TODO: tratar erro
	}

	const [user] = await db
		.select({ email: users.email, id: users.id })
		.from(users)
		.where(eq(users.id, session.userId));
	if (!user) return "error"; //TODO: tratar erro

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
		access: generateAccessToken(user),
	};
};
