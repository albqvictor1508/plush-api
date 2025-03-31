import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createChat } from "../../functions/create-chat";

export const createChatRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/chats",
		{
			schema: {
				body: z.object({
					title: z.string(),
					ownerId: z.string(),
					participantId: z.string(),
				}),
				response: {
					201: z.object({
						type: z.string(),
						id: z.number(),
						createdAt: z.date(),
						createdBy: z.string().uuid(),
						lastMessageAt: z.date(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { title, ownerId, participantId } = request.body;
			const chat = await createChat({ title, ownerId, participantId });
			return reply.status(201).send(chat);
		},
	);
};
