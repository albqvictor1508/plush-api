import { desc, eq, isNotNull } from "drizzle-orm";
import { db } from "../../drizzle/client";
import { chatParticipants, chats, messages, users } from "../../drizzle/schema";

export async function listChatsByUser(userId: string) {
  const listedChats = await db
    .select({ title: chats.title, id: chats.id, lastMessage: messages.content, lastMessageAt: chats.lastMessageAt })
    .from(chats).where(isNotNull(chats.lastMessageAt))
    .innerJoin(messages, eq(messages.chatId, chats.id))
    .innerJoin(chatParticipants, eq(chatParticipants.userId, userId))
    .orderBy(desc(chats.lastMessageAt))

  return { chat: listedChats }
}
