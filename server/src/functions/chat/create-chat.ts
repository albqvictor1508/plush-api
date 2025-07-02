import { db } from "../../drizzle/client";

import { chats, chatParticipants } from "../../drizzle/schema";
import type { CreateChatParams } from "../../types/messages";

export async function createChat({
  title,
  ownerId,
  participantsId,
}: CreateChatParams) {
  try {
    let chatType: "private" | "group" = "private";
    if (participantsId.length > 1) {
      chatType = "group";
    }
    const [chat] = await db
      .insert(chats)
      .values({ createdBy: ownerId, title, chatType })
      .returning();

    await db
      .insert(chatParticipants)
      .values({ userId: ownerId, chatId: chat.id, role: "admin" });

    for (const participantId of participantsId) {
      await db
        .insert(chatParticipants)
        .values({ userId: participantId, chatId: chat.id, role: "member" });
    }
    return chat;
  } catch (e) {
    throw new Error(`ERROR TO CREATE CHAT: ${e}`);
  }
}
