import { eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { chats, users } from "../drizzle/schema";

export async function listChatsByUser(userId: string) {
	const [listedChats] = await db
		.select()
		.from(chats)
		.where(eq(users.id, userId));
}
