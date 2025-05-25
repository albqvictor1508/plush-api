import {FastifyPluginAsyncZod} from "fastify-type-provider-zod"
import {z} from "zod"

export const LeaveGroupRoute: FastifyPluginAsyncZod = async(app) => {
    app.delete("/api/groups/:chatId/leave/:participantId", {
        schema: {
            params: z.object({
              chatId: z.string().transform(Number),
              participantId: z.string().uuid()
            })
        }
    },async (request, reply) => {

    })
}