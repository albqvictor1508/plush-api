export async function deleteMessage(
	userId: string,
	chatId: number,
	messageId: number,
) {
	if (user.id !== id || user.role !== "admin")
		return reply
			.status(400)
			.send("the message has to be yours or you have to be an admin");
	await db
		.delete(messages)
		.where(and(eq(messages.userId, user.id), eq(messages.chatId, chat.id)));
}
