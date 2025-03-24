import WebSocket from "ws";
import { db } from "../../../drizzle/client";
import { and, eq } from "drizzle-orm";
import { chatUsers } from "../../../drizzle/schema/chat-users";
import { chats } from "../../../drizzle/schema/chats";
import { messages } from "../../../drizzle/schema/messages";
import { wss } from "..";

export async function handleMessage(ws: WebSocket, data: WebSocket.RawData) {
	if (!ws.user) throw new Error("User not authenticated");

	const rawData = data.toString();
	if (rawData.length > 1_000_000) throw new Error("Message too large");

	const message = JSON.parse(rawData);
	if (!message.chatId || !message.content) {
		throw new Error("Invalid message format");
	}

	const [chat] = await db
		.select()
		.from(chats)
		.where(
			and(
				eq(chatUsers.chatId, message.chatId),
				eq(chatUsers.userId, ws.user.id),
			),
		);

	if (!chat) {
		throw new Error("Chat not found or access denied");
	}

	const [newMessage] = await db
		.insert(messages)
		.values({
			content: message.content,
			chatId: message.chatId,
			userId: ws.user.id,
		})
		.returning();

	await db
		.update(chats)
		.set({ lastMessageAt: new Date() })
		.where(eq(chats.id, message.chatId));

	const partcipants = await db
		.select({ userId: chatUsers.userId })
		.from(chatUsers)
		.where(eq(chatUsers.chatId, message.chatId));

	for (const client of wss.clients) {
		if (
			client.readyState === WebSocket.OPEN &&
			partcipants.some((p) => p.userId === client.user?.id)
		) {
			client.send(
				JSON.stringify({
					...newMessage,
					user: { id: ws.user.id, email: ws.user.email },
				}),
			);
		}
	}
}
