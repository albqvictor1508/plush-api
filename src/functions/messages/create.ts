import { eq } from "drizzle-orm";
import type { Message } from "src/@types";
import { db } from "src/db/client";
import { users } from "src/db/schema/users";

type MessageOptions = Omit<Message, "id">;

export const createMessage = async (body: MessageOptions) => {
  const { chatId, content, deletedAt, photo, sendedAt, updatedAt, userId } =
    body;

  const userExist = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId));
  if (userExist) throw new Error("error"); //WARN: tratar erro

  const chatExist = await db.select({ id });
};
