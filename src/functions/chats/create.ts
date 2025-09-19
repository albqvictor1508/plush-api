import { chatParticipants } from "src/db/schema/chat-participants";
import { eq } from "drizzle-orm";
import { db } from "src/db/client";
import { chats } from "src/db/schema/chats";
import { users } from "src/db/schema/users";
import { ErrorCodes } from "src/common/error/codes";
import { ErrorMessages } from "src/common/error/messages";

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

		//WARN: analisar o ownerId e o membro com role 'admin'
		const [chat] = await db
			.insert(chats)
			.values({
				id,
				avatar: avatar as string,
				description,
				title,
			})
			.returning({ id: chats.id });
		if (!chat) return { error: ErrorCodes.ErrorToCreateChat }; //WARN: tratar erro

		for (const id of participants) {
			const participant = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.id, id));

			if (!participant)
				return { error: ErrorCodes.ErrorToCreateChatParticipant }; //WARN: tratar erro

			await db.insert(chatParticipants).values({
				role: "member",
				userId: id,
				addedAt: new Date(),
				updatedAt: new Date(),
				chatId: chat.id,
			});
		}
	} catch (error) {
		console.log(error);
		throw error;
	}
};
