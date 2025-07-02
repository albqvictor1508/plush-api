import {FastifyPluginAsyncZod} from "fastify-type-provider-zod"
import {z} from "zod";
import { SearchContactByName } from "../../functions/contacts/search-by-name";

export const SearchContactByNameRoute: FastifyPluginAsyncZod = async(app) => {
    app.get("/api/contacts/:name", {schema: {
        params: z.object({
            name: z.string()
        })
    }}, async (request, reply) => {
        const {name} = request.params;
        const usersList = await SearchContactByName(name);
        return reply.status(200).send(usersList);
    })
}