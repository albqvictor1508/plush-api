import { db } from "../drizzle/client";
import { messages, users } from "../drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function updateMessage(
	userId: string,
	messageId: number,
	content: string,
) {
	const updatedMessage = await db
		.update(messages)
		.set({ content, updatedAt: new Date() })
		.where(and(eq(messages.userId, userId), eq(messages.id, messageId)))
		.returning();
	return updatedMessage;
}
