import { db } from "../drizzle/client";
import { messages } from "../drizzle/schema/messages";
import type { SendMessageParams } from "../types/messages";

export async function sendMessage({
	content,
	userId,
	socket,
}: SendMessageParams) {
	const clients = new Set<typeof socket>(); //criar um conjunto pra guardar as conexões

	const [message] = await db
		.insert(messages)
		.values({ userId, content })
		.returning();

	for (const client of clients) {
		if (client !== socket && client.readyState === client.OPEN) {
			client.send(message.content);
		}
	}
	return { message };
}
