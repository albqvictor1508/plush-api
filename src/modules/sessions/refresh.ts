import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/sessions/refresh",
		{
			schema: {
				response: {
					200: z.void(),
				},
			},
		},
		async (request, reply) => {},
	);
};
