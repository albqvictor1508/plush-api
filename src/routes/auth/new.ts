import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import "fastify";
import fastifyCookie from "fastify-cookie";
import fastifyJwt from "fastify-jwt";
import { z } from "zod";
import { codes } from "../../functions/send-code-to-user";
import { createUser } from "../../functions/create-user";

export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/auth/user",
		{ schema: { body: z.object({ email: z.string(), code: z.string() }) } },
		async (request, reply) => {
			const { email, code } = request.body;

			const storedCode = codes[email];
			if (!storedCode || storedCode.code !== code) {
				return reply.status(400).send({ error: "invalid or expired code" });
			}

			const user = await createUser({ email });
			const token = await reply.jwtSign({ id: user.id, email: user.email });

			reply.setCookie("plush_auth", token, {
				path: "/",
				httpOnly: true,
				signed: true,
				//sameSite: "strict" vou ver isso dps
			});

			return { success: true };
		},
	);
};
