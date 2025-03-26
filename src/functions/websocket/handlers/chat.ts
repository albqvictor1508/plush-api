import type { CreateChatParams } from "../../../types/messages";

export async function handleCreateChat({
	minimumParticipants,
	participantsIds,
	title,
	type,
	userId,
}: CreateChatParams) {
	// se o título for nulo e o chat for privado, coloco o titulo como o email do user
	// se o tipo for grupo, o userId vai pra dentro do participantsId
	// o createdBy do chat recebe a role de admin
	// os participantsIds devem ter, no mínimo, a length passada em minimumParticipants
}
