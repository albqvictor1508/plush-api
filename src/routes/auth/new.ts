import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { codes } from "../../functions/send-code-to-user";
import { createUser } from "../../functions/create-user";

export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/auth/user",
		{ schema: { body: z.object({ phone: z.string(), code: z.string() }) } },
		async (request, reply) => {
			const { phone, code } = request.body;

			const storedCode = codes[phone];
			if (!storedCode || storedCode.code !== code) {
				return reply.status(400).send({ error: "invalid or expired code" });
			}

			const user = await createUser({ phone });
			const token = app.jwt.sign({
				name: user.name,
				email: user.email,
			});
			return reply.setCookie("jwt", token).status(201).send(user);
		},
	);
};
