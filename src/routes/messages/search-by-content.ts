import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../drizzle/client";
import { eq, exists, ilike } from "drizzle-orm";
import { chats, messages } from "../../drizzle/schema";

export const SearchByContentRoute: FastifyPluginAsyncZod = async(app) => {
    app.get("/api/:chatId/messages/:content", {
        schema: {
            params: z.object({
              chatId: z.string().transform(Number),
              content: z.string()  
            })
        }
    },async (request, reply) => {
        const {chatId,content} = request.params;
        const [chatExists] = await db
        .select({exists: exists(chats)})
        .from(chats).where(eq(chats.id, chatId));

        if(!chatExists) return reply.status(400).send("This chat not exists");

        const messagesList = await db.select().from(messages).where(ilike(messages.content, content));
        return reply.status(200).send(messagesList);
    })
}