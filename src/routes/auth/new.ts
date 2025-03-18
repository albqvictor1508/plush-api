import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/auth/user",
		{ schema: { body: z.object({ name: z.string(), phone: z.string() }) } },
		async (request, reply) => {
			const { name, phone } = request.body;
			const result = await createUser({ name, phone });
		},
	);
};
