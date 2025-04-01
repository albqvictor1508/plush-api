import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createChat } from "../../functions/create-chat";
import { parseCookie } from "../../utils/parse-cookie";
import { db } from "../../drizzle/client";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const createChatRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/chats",
		{
			schema: {
				headers: z.object({
					cookie: z.string(),
				}),
				body: z.object({
					title: z.string().min(1).max(50),
					participantId: z.string().uuid(),
				}),
				response: {
					201: z.object({
						id: z.number(),
						createdAt: z.date(),
						createdBy: z.string().uuid(),
						lastMessageAt: z.date(),
					}),
				},
			},
		},
		async (request, reply) => {
			const { id } = await parseCookie(request.headers.cookie || "");
			const { title, participantId } = request.body;

			const [participantExists] = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.id, participantId));

			if (!participantExists?.id) {
				throw new Error("Invalid participant ID");
			}

			const chat = await createChat({ title, ownerId: id, participantId });
			return reply.status(201).send(chat);
		},
	);
};
