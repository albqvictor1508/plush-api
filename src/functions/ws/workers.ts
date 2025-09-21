import { randomUUID } from "node:crypto";
import { redis } from "src/common/cache";
import { db } from "src/db/client";
import { messages } from "src/db/schema/messages";

const key = "stream:chats";
const group = "lume_api_group";
const consumer = `consumer-${randomUUID()}`;

export const persistMessages = async () => {
	while (true) {
		const res = await redis.send("XREADGROUP", [
			"GROUP",
			group,
			consumer,
			"BLOCK",
			"2000",
			"STREAMS",
			key,
			">",
		]);

		if (!res) continue;

		const data = {
			id: "",
			senderId: "",
			chatId: "",
			content: "",
			status: "sended",
			photo: "",
			sendedAt: new Date(),
		};

		const [stream, messages] = res.shift();
		const salve = messages.map(([messageId, fields]) => {
			const msg: {
				senderId: string;
				chatId: string;
				content: string;
				avatar: string;
			} = Object.fromEntries(
				Array.from({ length: fields.length / 2 }, (_, i) => [fields[i * 2]]),
			);
		});

		const [persistedMsg] = await db.insert(messages).values(data).returning();
		await redis.send("XACK", [`chat:${data.chatId}:messages`, group, data.id]);
	}
};

export const listenMessages = async () => {};
