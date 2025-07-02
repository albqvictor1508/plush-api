import type WebSocket from "ws";
import { db } from "../../../drizzle/client";
import { and, eq } from "drizzle-orm";
import { chats, chatParticipants } from "../../../drizzle/schema";
import { z } from "zod";
import { JWTDecoded } from "../../../types/auth";
import { saveAndBroadcastMessage } from "../../messages/save-and-broadcast-message";

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

    await saveAndBroadcastMessage({
      chatId: message.chatId,
      content: message.content,
      user: user,
    });

  } catch (e) {
    console.error(e);
    ws.send(
      JSON.stringify(
        `ERROR ON HANDLE MESSAGE: ${e}, USER INFO: ${user.email}, DATA: ${data}`,
      ),
    );
  }
}
