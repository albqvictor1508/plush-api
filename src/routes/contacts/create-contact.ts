import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const CreateContactRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/contacts",
		{
			schema: {
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					userId: z.string().uuid(),
					photoUrl: z.optional(z.string().url()),
				}),
				response: {
					201: z.object({
						id: z.number(),
						name: z.string(),
						email: z.string().email(),
						userId: z.string().uuid(),
						photoUrl: z.optional(z.string().url()),
						createdAt: z.date(),
						updatedAt: z.date(),
					}),
				},
			},
		},
		async (request, response) => {},
	);
};
