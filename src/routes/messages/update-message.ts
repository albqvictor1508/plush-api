import {FastifyPluginAsyncZod} from "fastify-type-provider-zod";
import { z } from "zod";
import { parseCookie } from "../../utils/parse-cookie";

export const updateMessageRoute: FastifyPluginAsyncZod = async(app) => {
    app.put("/api/message", {    
    schema: {
        body: z.object({messageId: z.number(),content: z.string()})
    }
    }, async (request, reply) => {
        const userId = await parseCookie(request.headers.cookie || "");
        if(!userId) return reply.status(400).send();
        const {messageId, content} = request.body;
    })
}