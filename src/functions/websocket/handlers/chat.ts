import { db } from "../../../drizzle/client";
import { chats } from "../../../drizzle/schema/chats";
import type { CreateChatParams } from "../../../types/messages";

export async function handleCreateChat({ participantsId }: CreateChatParams) {
	// pegar as info do user pelo id dele
	const chat = await db.insert(chats).values({});
	// salvar no banco
	// criar o chat no banco
	//jogar os cara no chat
}
