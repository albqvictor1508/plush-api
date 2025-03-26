import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createChat: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/chats",
		{
			schema: {
				body: z.object({
					title: z.string(),
					type: z.enum(["private", "group"]),
					userId: z.string(),
					participantsIds: z.array(z.string()),
				}),
			},
		},
		() => {},
	);
};
