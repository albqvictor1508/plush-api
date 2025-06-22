import { db } from "../../drizzle/client";
import { messages } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

export async function deleteMessage(
  chatId: number,
  messageId: number,
): Promise<void> {
  await db
    .delete(messages)
    .where(and(eq(messages.chatId, chatId), eq(messages.id, messageId)));
}
