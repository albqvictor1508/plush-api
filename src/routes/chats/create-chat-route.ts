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
					userId: z.string(),
					participantId: z.string(),
				}),
				response: {
					201: z.object({
						success: z.boolean(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { title, userId, participantId } = request.body;
			await createChat({ title, userId, participantId });
			return reply.status(201).send({ success: true });
		},
	);
};
