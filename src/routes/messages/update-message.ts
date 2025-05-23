import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { parseCookie } from "../../utils/parse-cookie";
import { updateMessage } from "../../functions/update-message";
import type { MessageSchema } from "../../types/messages";

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
			if (!content) return reply.status(404).send("missing content");
			const updatedMessage: MessageSchema = await updateMessage(
				id,
				messageId,
				content,
			);
			return reply.status(200).send(updatedMessage);
		},
	);
};
