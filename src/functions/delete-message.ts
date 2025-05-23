import { db } from "../drizzle/client";
import { messages } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function deleteMessage(
	userId: string,
	chatId: number,
	messageId: number,
) {
	await db
		.delete(messages)
		.where(and(eq(messages.userId, userId), eq(messages.chatId, chatId)));
}
