import { db } from "../drizzle/client";
import { messages, users } from "../drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function updateMessage(
	userIdParam: string,
	messageIdParam: number,
	contentParam: string,
) {
	const allData = db
		.select({
			messageId: messages.id,
			messageUserId: messages.userId,
			userId: users.id,
		})
		.from(messages)
		.innerJoin(users, eq(users.id, userIdParam))
		.as("message_user");
}
