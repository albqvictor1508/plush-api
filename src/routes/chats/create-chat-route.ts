import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../drizzle/client";
import { chats } from "../../drizzle/schema/chats";

export const createChatRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/chats",
		{
			schema: {
				body: z.object({
					title: z.string(),
					type: z.enum(["private", "group"]),
					userId: z.string(),
					participantsIds: z.array(z.string()),
					minimumParticipants: z.number().min(1).max(2),
				}),
				response: {
					201: z.object({
						success: z.boolean(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { title, type, userId, ...rest } = request.body;

			//verificar se o chat entre esses dois existe
			const chatExists = await db.select().from(chats);
			return reply.status(201).send({ success: true });
		},
	);
};
