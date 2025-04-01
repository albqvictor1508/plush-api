import { db } from "../drizzle/client";
import { chatParticipants } from "../drizzle/schema/chat-participants";
import { chats } from "../drizzle/schema/chats";
import { Type, type CreateChatParams } from "../types/messages";

export async function createChat({
	title,
	ownerId,
	participantId,
}: CreateChatParams) {
	let type: Type;
	const participants = await db.$count(chatParticipants.userId);
	if (participants > 2) {
		type = Type.GROUP;
		return;
	}
	//cria chat
	const [chat] = await db.insert(chats).values({}).returning();

	await db
		.insert(chatParticipants)
		.values({ role: "admin", userId: ownerId, chatId: chat.id });

	await db
		.insert(chatParticipants)
		.values({ userId: participantId, chatId: chat.id, role: "admin" });

	return chat;
}
