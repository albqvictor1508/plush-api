import { eq } from "drizzle-orm";
import { db } from "../../drizzle/client";
import { chatUsers } from "../../drizzle/schema/chat-users";

const broadcastToChat = async (chatId: number, message: string) => {
	const participants = await db
		.select()
		.from(chatUsers)
		.where(eq(chatUsers.chatId, chatId));
};
