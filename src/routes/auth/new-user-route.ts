import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import "fastify";
import { z } from "zod";
import { codes } from "../../functions/user/send-code-to-user";
import { createUser } from "../../functions/user/create-user";
import { handleSendEmail } from "../../utils/send-email";

export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/auth/user",
		{
			schema: {
				body: z.object({
					email: z.string().email(),
					code: z.string().length(4),
				}),
			},
		},
		async (request, reply) => {
			const { email, code } = request.body;

			const storedCode = codes[email];
			if (!storedCode || storedCode.code !== code) {
				return reply.status(400).send({ error: "invalid or expired code" });
			}

			const [user] = await Promise.all([
				await createUser({ email }),
				await handleSendEmail({
					subject: "Welcome to Plush!",
					email,
					text: "salve",
				}),
			]);
			const token = await reply.jwtSign({ id: user.id, email: user.email });

			reply.setCookie("plush_auth", token, {
				path: "/",
				signed: false,
				httpOnly: true,
				//sameSite: "strict" vou ver isso dps
			});

			return { success: true };
		},
	);
};
