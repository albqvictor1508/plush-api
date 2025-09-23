import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { ErrorCodes } from "src/common/error/codes";
import { ErrorStatus } from "src/common/error/messages";
import { hashRefreshToken } from "src/config/auth";
import { db } from "src/db/client";
import { sessions } from "src/db/schema/sessions";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
	app.delete(
		"/sessions/@me",
		{
			schema: {
				summary: "Delete user sessions route",
				tags: ["sessions"],
				response: {
					200: z.void(),
					400: z.string(),
				},
			},
		},
		async (request, reply) => {
			const { refresh } = request.cookies;
			if (!refresh) return reply.code(400).send("Bad Credentials"); //WARN: TRATAR ERRO

			await db
				.delete(sessions)
				.where(eq(sessions.hash, hashRefreshToken(refresh)));

			return reply.status(200);
		},
	);
};
