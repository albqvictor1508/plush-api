import { db } from "../drizzle/client";

import { chats, chatParticipants } from "../drizzle/schema";
import type { CreateChatParams } from "../types/messages";

export async function createChat({
	title,
	ownerId,
	participantId,
}: CreateChatParams) {
	try {
		const [chat] = await db
			.insert(chats)
			.values({ createdBy: ownerId, title })
			.returning();

		await db
			.insert(chatParticipants)
			.values({ userId: ownerId, chatId: chat.id });

		await db
			.insert(chatParticipants)
			.values({ userId: participantId, chatId: chat.id });

		return chat;
	} catch (e) {
		console.error(e);
	}
}
