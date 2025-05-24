import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const CreateContactRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/contacts",
		{
			schema: {
				body: z.object({}),
			},
		},
		async (request, response) => {},
	);
};
