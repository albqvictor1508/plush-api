import { eq } from "drizzle-orm";
import type { Chat } from "src/@types";
import { db } from "src/db/client";
import { chatParticipants } from "src/db/schema/chat-participants";
import { chats } from "src/db/schema/chats";
import { users } from "src/db/schema/users";

type ChatOptions = Chat & { id: string };

export const createChat = async (body: ChatOptions) => {
  const { id, avatar, description, title, participants, ownerId } = body;

  //WARN: analisar o ownerId e o membro com role 'admin'
  const [chat] = await db
    .insert(chats)
    .values({
      id,
      ownerId,
      avatar,
      description,
      title,
    })
    .returning({ id: chats.id, ownerId: chats.ownerId });
  if (!chat) throw new Error("error"); //WARN: tratar erro

  for (const id of participants) {
    const participant = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, id));

    if (!participant) throw new Error("error"); //WARN: tratar erro

    await db.insert(chatParticipants).values({
      role: "member",
      userId: id,
      addedAt: new Date(),
      updatedAt: new Date(),
      chatId: chat.id,
    });
  }
};
