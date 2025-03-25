import type WebSocket from "ws";
import { db } from "../../../drizzle/client";
import { and, eq } from "drizzle-orm";
import { chatUsers } from "../../../drizzle/schema/chat-users";
import { chats } from "../../../drizzle/schema/chats";
import { messages } from "../../../drizzle/schema/messages";
import { z } from "zod";
import { app } from "../../../server";

const messageSchema = z.object({
	chatId: z.number(),
	content: z.string().max(1000),
});

export async function handleMessage(ws: WebSocket, data: WebSocket.RawData) {
	try {
		if (!ws.user) throw new Error("User not authenticated");

		const rawData = data.toString();
		if (rawData.length > 1000) throw new Error("Message too large");

		const message = JSON.parse(rawData);
		const validate = messageSchema.parse(message);

		//não ta validando o formato, tomar cuidado
		if (!validate.chatId || !validate.content) {
			throw new Error("Invalid message format");
		}

		const [chat] = await db
			.select()
			.from(chats)
			.innerJoin(
				chatUsers,
				and(
					eq(chatUsers.chatId, message.chatId),
					eq(chatUsers.userId, ws.user.id),
				),
			);

		if (!chat.chats || !chat?.chat_users) {
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
				client.readyState === client.OPEN &&
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
	} catch (e) {
		app.log.error(`Error on handle message: ${e}`);
		if (e instanceof SyntaxError) {
			throw new Error("The valid format is JSON");
		}
	}
}
