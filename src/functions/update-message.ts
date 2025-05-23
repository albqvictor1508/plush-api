import { db } from "../drizzle/client";
import { messages } from "../drizzle/schema";
import { and, eq } from "drizzle-orm";
import type { MessageSchema } from "../types/messages";

export async function updateMessage(
	userId: string,
	messageId: number,
	content: string,
): Promise<MessageSchema> {
	const [updatedMessage] = await db
		.update(messages)
		.set({ content, updatedAt: new Date() })
		.where(and(eq(messages.userId, userId), eq(messages.id, messageId)))
		.returning();
	return updatedMessage;
}
