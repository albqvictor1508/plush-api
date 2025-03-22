import { and, eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { chatUsers } from "../drizzle/schema/chat-users";

const getUserIdFromCookie = (cookieHeader: string | undefined): string => {
	return "";
};

const verifyChatMembership = async (chatId: number, userId: string) => {
	const isMember = await db
		.select()
		.from(chatUsers)
		.where(and(eq(chatUsers.userId, userId), eq(chatUsers.chatId, chatId)))
		.limit(1);

	return isMember.length > 0; //se for maior que 0 vai retornar true, validando se é participante daquele chat ou não
};
