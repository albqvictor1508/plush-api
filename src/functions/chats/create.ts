import { eq } from "drizzle-orm";
import type { ErrorSchema } from "src/@types";
import { ErrorCodes } from "src/common/error/codes";
import { ErrorMessages, ErrorStatus } from "src/common/error/messages";
import { db } from "src/db/client";
import { chatParticipants } from "src/db/schema/chat-participants";
import { chats } from "src/db/schema/chats";
import { users } from "src/db/schema/users";

type ChatOptions = {
  id: string;
  title: string;
  avatar: string;
  description: string;
  participants: Set<string>;
};

export const createChat = async (body: ChatOptions) => {
  try {
    const { id, avatar, description, title, participants } = body;

    const [chat] = await db
      .insert(chats)
      .values({
        id,
        avatar,
        description,
        title,
      })
      .returning({ id: chats.id });
    if (!chat)
      return {
        error: "bugou aq",
        code: 500,
      };

    for (const id of participants) {
      const participant = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, id));

      if (!participant)
        return {
          error: ErrorMessages[ErrorCodes.ErrorToCreateChatParticipant],
          code: ErrorStatus[ErrorCodes.ErrorToCreateChatParticipant],
        };

      await db.insert(chatParticipants).values({
        role: "member",
        userId: id,
        addedAt: new Date(),
        updatedAt: new Date(),
        chatId: chat.id,
      });
    }

    return { id: chat.id };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
