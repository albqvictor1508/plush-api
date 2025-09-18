import { eq } from "drizzle-orm";
import type { Chat } from "src/@types";
import { db } from "src/db/client";
import { chatParticipants } from "src/db/schema/chat-participants";
import { chats } from "src/db/schema/chats";
import { users } from "src/db/schema/users";

type ChatOptions = Omit<Chat, "id">;

export const createChat = async (body: ChatOptions) => {
	const {
		avatar,
		createdAt,
		description,
		title,
		updatedAt,
		participants: participantIds,
		ownerId,
	} = body;

	const ownerExist = await db
		.select({ id: users.id })
		.from(users)
		.where(eq(users.id, ownerId));
	if (!ownerExist) throw new Error("error"); //WARN: tratar erro

	const [chat] = await db
		.insert(chats)
		.values({
			ownerId,
			avatar,
			description,
			title,
			createdAt,
			updatedAt,
		})
		.returning({ id: chats.id, ownerId: chats.ownerId });
	if (!chat) throw new Error("error"); //WARN: tratar erro

	for (const id of participantIds) {
		const participant = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.id, id));

		if (!participant) throw new Error("error"); //WARN: tratar erro

		await db.insert(chatParticipants).values({
			chatId: chat.id,
			role: "member",
			userId: id,
			addedAt: new Date(),
			updatedAt: new Date(),
		});
	}
};
