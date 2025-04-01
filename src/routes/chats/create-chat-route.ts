import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createChat } from "../../functions/create-chat";
import { app } from "../../server";

export const createChatRoute: FastifyPluginAsyncZod = async (fastify) => {
	fastify.post(
		"/api/chats",
		{
			schema: {
				headers: z.object({
					cookie: z.string(),
				}),
				body: z.object({
					title: z.string(),
					participantId: z.string(),
				}),
				response: {
					201: z.object({
						id: z.number(),
						createdAt: z.date(),
						createdBy: z.string().uuid(),
						lastMessageAt: z.date(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { userId } = app.parseCookie(request.headers.cookie);
			console.log(userId);

			const { title, participantId } = request.body;
			const chat = await createChat({ title, ownerId: userId, participantId });
			return reply.status(201).send(chat);
		},
	);
};
