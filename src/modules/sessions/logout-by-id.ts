import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "src/db/client";
import { sessions } from "src/db/schema/sessions";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
	app.delete(
		"/sessions/:id",
		{
			schema: {
				params: z.object({
					id: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { id } = request.params;
			//@ts-expect-error
			const { id: userId } = request.auth;

			await db
				.delete(sessions)
				.where(and(eq(sessions.id, id), eq(sessions.userId, userId)));
			return reply.code(200);
		},
	);
};
