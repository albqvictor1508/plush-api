import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { generateAccessToken, generateRefreshToken } from "src/common/auth";
import { redis } from "src/common/cache";
import { Snowflake } from "src/common/snowflake";
import { TWO_MIN_IN_SECS } from "src/core";
import { db } from "src/db/client";
import { schema } from "src/db/schema";
import { parse as getAgent } from "useragent";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/sessions",
		{
			schema: {
				body: z.object({
					email: z.email({ error: "Invalid email." }),
					avatar: z.optional(z.string()),
					password: z
						.string()
						.min(6, {
							error: "the password must to be greater than 6 characters",
						})
						.max(20, {
							error: "the password must to be less than 20 characters",
						}), //usar o refine() pra validar senha com caracter especial e td mais
					name: z
						.string()
						.min(3, {
							error: "the username must to be greater than 3 characters",
						})
						.max(16, {
							error: "the username must to be less than 16 characters",
						}),
				}),
				response: {
					201: z.void(),
					400: z.string(),
					500: z.string(),
				},
			},
		},
		async (request, reply) => {
			const agent = getAgent(request.headers["user-agent"]);
			if (agent.family === "Other") return reply.code(400).send("dps"); //TODO: mudar erro

			const { users, sessions } = schema;
			const { email, password, avatar, name } = request.body;
			//salvar avatar no bucket (multipart/data)
			//validar sessão do usuário

			const isEmailUsed = await db
				.select({ email: users.email })
				.from(users)
				.where(eq(users.email, email));
			if (isEmailUsed) return reply.code(400).send("dps eu crio o erro");

			const isUsernameUsed = await db
				.select({ name: users.name })
				.from(users)
				.where(eq(users.name, email));
			if (isUsernameUsed) return reply.code(400).send("dps eu crio o erro");

			const hashedPassword = await Bun.password.hash(password);

			const id = (await new Snowflake().create()).toString();
			const [user] = await db
				.insert(users)
				.values({
					id,
					email,
					name,
					password: hashedPassword,
				})
				.returning({ id: users.id, email: users.email });
			if (!user) return reply.status(500).send("dps eu crio");

			redis.setex(`users:${user?.id}`, TWO_MIN_IN_SECS, JSON.stringify(user));

			const access = await generateAccessToken(user);
			const { hash, token } = generateRefreshToken();

			await db.insert(sessions).values({
				hash,
				userId: user.id,
				browser: agent.family,
				os: agent.os.family,
				ip: request.ip,
			});

			await reply.setCookie("refresh", token);
			await reply.setCookie("access", access);

			await reply.code(201);
		},
	);
};
