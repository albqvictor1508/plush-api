import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {z} from "zod"
import { db } from "../../drizzle/client";
import { eq, exists } from "drizzle-orm";
import { chatParticipants, chats } from "../../drizzle/schema";
import { parseCookie } from "../../utils/parse-cookie";

export const DeleteGroupRoute: FastifyPluginAsyncZod = async(app) => {
    app.delete("/api/groups/:chatId", {
        schema: {
            params: z.object({
                chatId: z.string().transform(Number)
            })
        }
    },async (request, reply) => {
        const {id: userId} = await parseCookie(request.headers.cookie || "");
        const {chatId} = request.params;

        const [chatExists] = await db
        .select({exists: exists(chats)})
        .from(chats)
        .where(eq(chats.id, chatId));

        if(!chatExists) return reply.status(400).send("this chat not exist");

        await db.delete(chatParticipants).where(eq(chatParticipants.chatId, chatId));
        await db.delete(chats).where(eq(chats.id, chatId));
    })
}