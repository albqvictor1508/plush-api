import { Type, type CreateChatParams } from "../types/messages";

export async function createChat({
	minimumParticipants,
	title,
	participantsIds,
	userId,
	type,
}: CreateChatParams) {
	//se tiver mais de duas pessoas, definir grupo como privado
	//cria chat
	//cria participante (tabela chatUsers)
}
