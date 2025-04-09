import { db } from "../drizzle/client";

import { chats, chatParticipants } from "../drizzle/schema";
import type { CreateChatParams } from "../types/messages";

export async function createChat({
	title,
	ownerId,
	participantsId,
}: CreateChatParams) {
	try {
		let chatType: "private" | "group" = "private";
		const [chat] = await db
			.insert(chats)
			.values({ createdBy: ownerId, title })
			.returning();

		await db
			.insert(chatParticipants)
			.values({ userId: ownerId, chatId: chat.id });

		for (const participantId of participantsId) {
			if (participantsId.length > 1) {
				chatType = "group";
			}
			await db
				.insert(chatParticipants)
				.values({ userId: participantId, chatId: chat.id });
		}

		return chat;
	} catch (e) {
		throw new Error(`ERROR TO CREATE CHAT: ${e}`);
	}
}
