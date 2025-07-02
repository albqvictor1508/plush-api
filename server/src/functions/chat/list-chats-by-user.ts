import { desc, eq, isNotNull } from "drizzle-orm";
import { db } from "../../drizzle/client";
import { chatParticipants, chats, messages, users } from "../../drizzle/schema";

export async function listChatsByUser(userId: string) {
  const listedChats = await db
    .select({ title: chats.title, id: chats.id, lastMessage: messages.content, lastMessageAt: chats.lastMessageAt })
    .from(chats)
    .innerJoin(chatParticipants, eq(chats.id, chatParticipants.chatId))
    .leftJoin(messages, eq(messages.chatId, chats.id))
    .where(eq(chatParticipants.userId, userId))
    .orderBy(desc(chats.lastMessageAt))

  return { chat: listedChats }
}
