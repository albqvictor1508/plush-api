import { eq } from "drizzle-orm";
import { db } from "../../drizzle/client";
import { chatParticipants, chats, messages } from "../../drizzle/schema";
import { wss } from "../websocket";
import { JWTDecoded } from "../../types/auth";

interface SaveAndBroadcastMessageParams {
  chatId: number;
  content: string;
  user: JWTDecoded,
  status: "sent" | "delivered"
}

export async function saveAndBroadcastMessage({
  chatId,
  content,
  user,
  status
}: SaveAndBroadcastMessageParams) {
  const [newMessage] = await db
    .insert(messages)
    .values({
      content,
      chatId,
      status,
      userId: user.id,
      fileUrl: ""
    })
    .returning();

  await db
    .update(chats)
    .set({ lastMessageAt: new Date() })
    .where(eq(chats.id, chatId));

  const participants = await db
    .select({ userId: chatParticipants.userId })
    .from(chatParticipants)
    .where(eq(chatParticipants.chatId, chatId));

  for (const client of wss.clients) {
    if (
      client.readyState === client.OPEN &&
      participants.some((p) => p.userId === user.id)
    ) {
      client.send(
        JSON.stringify({
          ...newMessage,
          user: { id: user.id, email: user.email },
        }),
      );
    }
  }

  return newMessage;
}
