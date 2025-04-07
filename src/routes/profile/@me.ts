import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getProfileRoute: FastifyPluginAsyncZod = async (app) => {
	app.put(
		"/api/@me",
		{
			schema: {
				body: z.object({ name: z.string(), email: z.string().email() }),
			},
		},
		(request, reply) => {},
	);
};
