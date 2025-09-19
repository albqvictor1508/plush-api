import { eq } from "drizzle-orm";
import {
	EventType,
	type OutgoingEventMap,
	type WsHandler,
} from "src/@types/ws";
import { db } from "src/db/client";
import { chatParticipants } from "src/db/schema/chat-participants";
import { chats } from "src/db/schema/chats";
import { users } from "src/db/schema/users";
import { createChat } from "src/functions/chats/create";

export const handlers: WsHandler = {
	[EventType.CHAT_CREATED]: async (body) => {},

	[EventType.JOIN_CHAT]: async (body) => {
		const { chatId, participants } = body;

		const [chat] = await db
			.select({ id: chats.id })
			.from(chats)
			.where(eq(chats.id, chatId));
		if (!chat) throw new Error("error"); //WARN: tratar erro

		for (const id of participants) {
			const participant = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.id, id));

			if (!participant) throw new Error("error"); //WARN: tratar erro

			await db.insert(chatParticipants).values({
				role: "member",
				userId: id,
				addedAt: new Date(),
				updatedAt: new Date(),
				chatId: chat.id,
			});
		}
	},
	[EventType.CHAT_UPDATED]: async (body) => {},
	[EventType.OUT_CHAT]: async (body) => {
		console.log("vai toma no cu");
	},
	[EventType.MESSAGE_CREATED]: async (body) => {},
	[EventType.MESSAGE_DELETED]: async (body) => {},
	[EventType.MESSAGE_UPDATED]: async (body) => {},
} as const;

/*
export const sendEvent = async <T extends keyof OutgoingEventMap>(
  ws: WebSocket,
  type: T,
  body: OutgoingEventMap[T],
) => {
  ws.send(JSON.stringify({ type, body }));
};

 *export const onEvent = async <T extends keyof IncomingEventMap>(
  ws: WebSocket,
  type: T,
  handler: (body: IncomingEventMap[T]) => void,
) => { };
 * */
