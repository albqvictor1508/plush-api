import type WebSocket from "ws";
import { db } from "../../../drizzle/client";
import { and, eq } from "drizzle-orm";
import { chats, chatParticipants } from "../../../drizzle/schema";
import { messages } from "../../../drizzle/schema/messages";
import { z } from "zod";
import { app } from "../../../server";
import { wss } from "../../../common/websocket";

const messageSchema = z.object({
	chatId: z.number(),
	content: z.string().max(1000),
});

export async function handleMessage(ws: WebSocket, data: WebSocket.RawData) {
	try {
		if (!ws.user) throw new Error("User not authenticated");

		const rawData = data.toString();
		app.log.error("toma no cu mizera");
		if (rawData.length > 1000) throw new Error("Message too large");

		const message = JSON.parse(rawData);

		const [chat] = await db
			.select()
			.from(chats)
			.innerJoin(
				chatParticipants,
				and(
					eq(chatParticipants.chatId, message.chatId),
					eq(chatParticipants.userId, ws.user.id),
				),
			);

		if (!chat?.chats || !chat?.chat_participants) {
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
			.select({ userId: chatParticipants.userId })
			.from(chatParticipants)
			.where(eq(chatParticipants.chatId, message.chatId));

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
		ws.send(
			JSON.stringify(
				`ERROR ON HANDLE MESSAGE: ${e}, USER INFO: ${ws.user?.email}, DATA: ${data}`,
			),
		);
	}
}
