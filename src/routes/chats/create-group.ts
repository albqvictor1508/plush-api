import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {z} from "zod";

export const CreateGroupRoute: FastifyPluginAsyncZod = async(app) => {
    app.post("/api/groups", {
        schema: {
            body: z.object({
                title: z.string(),
                createdBy: z.string().uuid(),
                participantsId: z.array(z.string().uuid()),
                photoUrl: z.string().url().optional()
            })
        }
    },async (request, reply) => {

    })
}