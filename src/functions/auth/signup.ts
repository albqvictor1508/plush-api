import { eq } from "drizzle-orm";
import { redis } from "src/common/cache";
import { Snowflake } from "src/common/snowflake";
import { db } from "src/db/client";
import { users } from "src/db/schema/users";
import type { UserMetadata } from "src/types";

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

	const id = (await new Snowflake().create()).toString();
	const [user] = await db
		.insert(users)
		.values({
			id,
			email,
			name,
			password,
			authId,
			avatar,
		})
		.returning({ id: users.id, email: users.email });
	if (!user) throw new Error("tratar erro"); //WARN: tratar erro

	await redis.send("SETEX", [
		`users:${user.id}`,
		TWO_MIN_IN_SECS,
		JSON.stringify(user),
	]);
};
