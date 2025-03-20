import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { sendCodeToUser } from "../../functions/send-code-to-user";

export const sendCodeToUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/auth/user/send",
		{
			schema: {
				body: z.object({
					name: z.string(),
					phone: z.string(),
					code: z.optional(z.string()),
				}),
			},
		},
		async (request, reply) => {
			const { name, phone } = request.body;
			await sendCodeToUser({ name, phone });
			return reply.status(200).send({ success: true });
		},
	);
};
