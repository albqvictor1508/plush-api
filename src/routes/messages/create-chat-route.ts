import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createChatRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/chats",
		{
			schema: {
				body: z.object({ title: z.string(), participantId: z.string().uuid() }),
			},
		},
		async (request, reply) => {},
	);
};
