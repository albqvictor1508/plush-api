import {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import { z } from "zod";
import { parseCookie } from "../../utils/parse-cookie";
import { db } from "../../drizzle/client";
import { messages } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const updateMessageRoute: FastifyPluginAsyncZod = async(app) => {
    app.put("/api/message", {    
    schema: {
        body: z.object({messageId: z.number(),content: z.string()})
    }
    }, async (request, reply) => {
        const userId = await parseCookie(request.headers.cookie || "");
        if(!userId) return reply.status(400).send();
        const {messageId, content} = request.body;
        const updatedMessage = await db.update(messages).set({content, updatedAt: new Date()}).where(eq(messages.id, messageId)).returning();

    })
}