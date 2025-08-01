import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { parseCookie } from "../../utils/parse-cookie";
import { db } from "../../drizzle/client";
import { chatParticipants, chats, messages, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { deleteMessage } from "../../functions/messages/delete-message";

export const deleteMessageRoute: FastifyPluginAsyncZod = async (app) => {
	app.delete(
		"/api/messages",
		{
			schema: {
				body: z.object({
					userId: z.string(),
					chatId: z.number(),
					messageId: z.number(),
				}),
			},
		},
		async (request, reply) => {
			const { userId, chatId, messageId } = request.body;
			const { id } = await parseCookie(request.headers.cookie || "");

			const [chat] = await db.select().from(chats).where(eq(chats.id, chatId));
			const [message] = await db
				.select()
				.from(messages)
				.where(eq(messages.id, messageId));
			const [user] = await db
				.select({ id: users.id, role: chatParticipants.role })
				.from(chatParticipants)
				.where(
					and(
						eq(chatParticipants.chatId, chatId),
						eq(chatParticipants.userId, userId),
					),
				);
			if (!user) return reply.status(404).send("user not founded");
			if (!chat) return reply.status(404).send("chat not founded");
			if (!message) return reply.status(404).send("message not founded");
			if (user.id !== id || user.role !== "admin")
				return reply
					.status(400)
					.send("the message has to be yours or you have to be an admin");

			try {
				await deleteMessage(message.id, chat.id);
			} catch (error) {
				reply.status(400).send(`ERROR DELETING MESSAGE ${error}`);
			}

			return reply.status(200);
		},
	);
};
