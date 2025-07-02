import type WebSocket from "ws";
import { db } from "../../../drizzle/client";
import { and, eq } from "drizzle-orm";
import { chats, chatParticipants } from "../../../drizzle/schema";
import { messages } from "../../../drizzle/schema/messages";
import { z } from "zod";
import { wss } from "..";
import { JWTDecoded } from "../../../types/auth";

const createMessageParams = z.object({
  chatId: z.number(),
  content: z.string(),
});

export async function handleMessage(ws: WebSocket, user: JWTDecoded, data: WebSocket.RawData) {
  try {
    if (!user) throw new Error("User not authenticated");

    const rawData = data.toString();
    if (rawData.length > 1000) throw new Error("Message too large");

    const message = JSON.parse(rawData);
    createMessageParams.parse(message);

    const [chat] = await db
      .select()
      .from(chats)
      .innerJoin(
        chatParticipants,
        and(
          eq(chatParticipants.chatId, message.chatId),
          eq(chatParticipants.userId, user.id),
        ),
      );

    if (!chat?.chats || !chat?.chat_participants) {
      throw new Error("Chat not found or access denied");
    }

    const [newMessage] = await db
      .insert(messages)
      .values({
        content: message.content,
        chatId: message.chatId,
        userId: user.id,
        status: "sent", //pensar como vou realizar essa troca de status
      })
      .returning();

    await db
      .update(chats)
      .set({ lastMessageAt: new Date() })
      .where(eq(chats.id, message.chatId));

    const participants = await db
      .select({ userId: chatParticipants.userId })
      .from(chatParticipants)
      .where(eq(chatParticipants.chatId, message.chatId));

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
  } catch (e) {
    console.error(e);
    ws.send(
      JSON.stringify(
        `ERROR ON HANDLE MESSAGE: ${e}, USER INFO: ${user.email}, DATA: ${data}`,
      ),
    );
  }
}
