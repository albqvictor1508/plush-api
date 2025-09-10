import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { generateAccessToken, generateRefreshToken } from "src/common/auth";
import { redis } from "src/common/cache";
import { Snowflake } from "src/common/snowflake";
import { TWO_MIN_IN_SECS } from "src/core";
import { db } from "src/db/client";
import { schema } from "src/db/schema";
import { signup } from "src/functions/auth/signup";
import { parse as getAgent } from "useragent";
import z from "zod";

const FIFTEEN_DAYS_LATER = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

export const route: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/sessions/signup",
		{
			schema: {
				body: z.object({
					authId: z.optional(z.string()),
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

			const { email, password, avatar, name, authId } = request.body;
			//salvar avatar no bucket (multipart/data)
			//validar sessão do usuário

			const {} = await signup({
				meta: {
					browser: agent.family,
					ip: request.ip,
					os: agent.os.family,
				},
				user: {
					email,
					name,
					avatar: avatar ?? "",
					authId: authId ?? "",
					password,
				},
			});

			await reply.setCookie("refresh", token);
			await reply.setCookie("access", access);

			return await reply.code(201);
		},
	);
};
