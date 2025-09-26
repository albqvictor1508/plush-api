import { eq } from "drizzle-orm";

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
	ownerId: string;
	description: string;
	participants: string;
};

export const createChat = async (body: ChatOptions) => {
	try {
		const { id, avatar, description, title, ownerId, participants } = body;

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

		await db.insert(chatParticipants).values({
			chatId: chat.id,
			userId: ownerId,
			role: "owner",
			addedAt: new Date(),
		});

		for (const id of participants) {
			const [participant] = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.id, id));

			if (!participant)
				return {
					error: ErrorMessages[ErrorCodes.ErrorToCreateChatParticipant],
					code: ErrorStatus[ErrorCodes.ErrorToCreateChatParticipant],
				};

			await db.insert(chatParticipants).values({
				userId: participant.id,
				chatId: chat.id,
				role: "member",
				addedAt: new Date(),
				updatedAt: new Date(),
			});
		}

		return { id: chat.id };
	} catch (error) {
		console.log(error);
		console.log(`error to create chat: ${error}`);
		throw error;
	}
};
