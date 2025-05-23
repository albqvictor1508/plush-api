import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { parseCookie } from "../../utils/parse-cookie";
import { db } from "../../drizzle/client";
import { chatParticipants, users } from "../../drizzle/schema";
import { eq, and} from "drizzle-orm";


export const deleteMessageRoute: FastifyPluginAsyncZod = async (app) => {
	app.delete(
		"/api/messages",
		{
			schema: {
				body: z.object({ userId: z.string(), chatId: z.number(), messageId: z.number() }),
			},
		},
		async (request, response) => {
            const {userId,chatId,messageId} = request.body;

            const [user] = await db
            .select({id: users.id,role: chatParticipants.role })
            .from(chatParticipants)
            .where(
                and(eq(chatParticipants.chatId, chatId), eq(chatParticipants.userId, userId))
            );
			const { id } = await parseCookie(request.headers.cookie || "");
            if(user.id !== id || user.role !== "admin")
		},
	);
};
