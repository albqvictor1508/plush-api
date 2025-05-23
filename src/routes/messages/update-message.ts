import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { parseCookie } from "../../utils/parse-cookie";
import { db } from "../../drizzle/client";
import { messages } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { updateMessage } from "../../functions/update-message";

export const updateMessageRoute: FastifyPluginAsyncZod = async (app) => {
	app.put(
		"/api/message",
		{
			schema: {
				body: z.object({ messageId: z.number(), content: z.string() }),
			},
		},
		async (request, reply) => {
			const { id } = await parseCookie(request.headers.cookie || "");
			const { messageId, content } = request.body;
			if (!id) return reply.status(400).send("missing or invalid userId");
			if (!messageId)
				return reply.status(400).send("missing or invalid messageId");
			if (!content) return reply.status(400).send("missing content");
			const updatedMessage = await updateMessage(id, messageId, content);
			return reply.status(200).send(updatedMessage);
		},
	);
};
