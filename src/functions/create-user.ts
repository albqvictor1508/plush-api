import { db } from "../drizzle/client";
import { users } from "../drizzle/schema/users";
import type { NewAccountTemporaryData } from "../types/auth";
import { codes } from "./send-code-to-user";

export async function createUser({ phone }: { phone: string }) {
	const setting: NewAccountTemporaryData = codes[phone]; //vai puxar as informações do usuário que eu salvei na outra função
	const user = await db
		.insert(users)
		.values({ name: setting.name, phone: setting.phone })
		.returning();

	return user;
}
