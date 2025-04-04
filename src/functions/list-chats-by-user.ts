import { eq, max, or } from "drizzle-orm";
import { db } from "../drizzle/client";
import { chatParticipants, chats, messages, users } from "../drizzle/schema";

export async function listChatsByUser(userId: string) {
	const listedChats = await db
		.select()
		.from(chats)
		.where(eq(users.id, userId))
		.orderBy(chats.lastMessageAt);

	const lastMessage = await db
		.select({ value: max(messages.createdAt) })
		.from(messages)
		.where(eq(chatParticipants.userId, userId));

	return { chats: { ...listedChats, lastMessage } };
}
