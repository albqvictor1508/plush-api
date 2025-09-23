import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { check } from "src/functions/health/health";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/health",
		{
			schema: {
				summary: "Health check route",
				tags: ["health"],
				response: {
					200: z.object({
						readyAt: z.date(),
						cache: z.object({
							ok: z.boolean(),
							reply: z.optional(z.number()),
						}),
						db: z.object({
							ok: z.boolean(),
							reply: z.optional(z.number()),
						}),
						uptime: z.number(),
						ok: z.boolean(),
					}),
				},
			},
		},
		async (_, reply) => {
			const health = await check();
			return reply.status(200).send(health);
		},
	);
};
