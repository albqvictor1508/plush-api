import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { verifyAgent } from "src/common/agent";
import { login } from "src/functions/auth/login";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/sessions",
		{
			schema: {
				body: z.object({
					email: z.string(),
					password: z.string().min(6).max(30),
				}),
			},
		},
		async (request, reply) => {
			const { email, password } = request.body;
			const agent = verifyAgent(request.headers["user-agent"]);

			const FIFTEEN_MIN_IN_MS = 900000;
			const FIFTEEN_DAYS_IN_MS = 1.296e9;

			const { access, refresh } = await login({
				email,
				password,
				meta: {
					os: agent.os.family,
					browser: agent.family,
					ip: request.ip,
				},
			});

			await reply.setCookie("access", access, { maxAge: FIFTEEN_MIN_IN_MS });
			await reply.setCookie("refresh", refresh, { maxAge: FIFTEEN_DAYS_IN_MS });

			await reply.code(200);
		},
	);
};
