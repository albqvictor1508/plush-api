import {FastifyPluginAsyncZod} from "fastify-type-provider-zod"
import {z} from "zod";

export const SearchContactByNameRoute: FastifyPluginAsyncZod = async(app) => {
    app.get("/api/contacts/:name", {schema: {
        params: {
            name: z.string()
        }
    }}, async (request, reply) => {
        
    })
}