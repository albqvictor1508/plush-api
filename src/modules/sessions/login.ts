import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { parse as getAgent } from "useragent";
import { db } from "src/db/client";
import { users } from "src/db/schema/users";
import z from "zod";
import { eq } from "drizzle-orm";
import { generateAccessToken, generateRefreshToken } from "src/common/auth";
import { sessions } from "src/db/schema/sessions";
import { sweepCredentials } from "src/functions/auth/sweep-credentials";

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
			const agent = getAgent(request.headers["user-agent"]);

			if (agent.family === "Other") return "error"; //WARN: tratar erro

			const [user] = await db
				.select({ id: users.id, password: users.password })
				.from(users)
				.where(eq(users.email, email));

			if (
				!user ||
				(user.password && !(await Bun.password.verify(password, user.password)))
			)
				return "error"; //WARN: tratar erro

			const MAX_SESSIONS_PER_USER = 10;
			const SEVEN_DAYS_AFTER = new Date(Date.now() + 6.048e8);

			const { hash, token } = generateRefreshToken();

			const [_, [session]] = await Promise.all([
				sweepCredentials(user.id, MAX_SESSIONS_PER_USER),
				db
					.insert(sessions)
					.values({
						userId: user.id,
						hash,
						browser: agent.family,
						os: agent.os.family,
						ip: request.ip,
						expiresAt: SEVEN_DAYS_AFTER,
					})
					.returning({ id: sessions.userId }),
			]);

			const FIFTEEN_MIN_IN_MS = 900000;
			const FIFTEEN_DAYS_IN_MS = 1.296e9;

			if (!session) return "error"; //WARN: tratar erro
			const access = await generateAccessToken({ id: session.id, email });

			await reply.setCookie("access", access, { maxAge: FIFTEEN_MIN_IN_MS });
			await reply.setCookie("refresh", token, { maxAge: FIFTEEN_DAYS_IN_MS });

			await reply.code(200);
		},
	);
};
