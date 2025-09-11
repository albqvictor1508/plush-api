import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { check } from "src/functions/health/health";

export const route: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/health",
		{
			schema: {
				summary: "Health check route",
				tags: ["health"],
				response: {},
			},
		},
		async (_, reply) => {
			const health = await check();
			return reply.status(200).send(health);
		},
	);
};
