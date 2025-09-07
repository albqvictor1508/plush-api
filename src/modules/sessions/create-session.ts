import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { redis } from "src/common/cache";
import { Snowflake } from "src/common/snowflake";
import { db } from "src/db/client";
import { users } from "src/db/schema/users";
import type { JWTPayload } from "src/types";
import z from "zod";

//const { APP_NAME } = env;
const FIFTEEN_MIN = "15m";
const FIFTEEN_DAYS = "15d";
const TWO_MIN_IN_SECS = "120";

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
				},
			},
		},
		async (request, reply) => {
			const { jwt } = app;
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

			const hashedPassword = await bcrypt.hash(password, 10);

			const id = await new Snowflake().create();
			const [user] = await db
				.insert(users)
				.values({
					id,
					email,
					name,
					password: hashedPassword,
				})
				.returning({ id: users.id, email: users.email });
			redis.setex(`users:${email}`, TWO_MIN_IN_SECS, JSON.stringify(user));

			const access = jwt.sign(user as JWTPayload, { expiresIn: FIFTEEN_MIN });
			const refresh = jwt.sign(user as JWTPayload, { expiresIn: FIFTEEN_DAYS });

			reply.setCookie("refresh", refresh);
			reply.setCookie("access", access);
		},
	);
};
