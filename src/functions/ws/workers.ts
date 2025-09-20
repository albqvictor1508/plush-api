import { randomUUID } from "node:crypto";
import { redis } from "src/common/cache";
import { db } from "src/db/client";
import { messages } from "src/db/schema/messages";

const key = "stream:chats";
const group = "lume_api_group";
const consumer = `consumer-${randomUUID()}`;

export const persistMessages = async () => {
	const data = {
		id: "",
		senderId: "",
		chatId: "",
		content: "",
		status: "sended",
		photo: "",
		sendedAt: new Date(),
	};
	//while (true) {}

	await db.insert(messages).values(data);
	await redis.send("XACK", [`chat:${data.chatId}:messages`, group, data.id]);
};

export const listenMessages = async () => {};
