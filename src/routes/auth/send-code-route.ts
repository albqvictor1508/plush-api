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
					email: z.string().email(),
				}),
				response: {
					200: z.object({
						success: z.boolean()
					})
				}
			},
		},
		async (request, reply) => {
			const { name, email } = request.body;
			await sendCodeToUser({ name, email });
			return reply.status(200).send({ success: true });
		},
	);
};
