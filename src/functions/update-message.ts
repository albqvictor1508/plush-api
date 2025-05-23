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
			updatedAt: messages.updatedAt,
		})
		.from(messages)
		.innerJoin(users, eq(users.id, messages.userId))
		.as("message_user");

	const updatedMessage = await db
		.with(allData)
		.update(messages)
		.set({ content: contentParam, updatedAt: new Date() })
		.where(
			and(
				eq(allData.userId, userIdParam),
				eq(allData.messageId, messageIdParam),
			),
		)
		.returning();

	return updatedMessage;
}
