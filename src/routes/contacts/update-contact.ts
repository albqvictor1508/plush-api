import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {z} from "zod";

export const UpdateContactRoute: FastifyPluginAsyncZod = async(app) => {
    app.put("/api/contacts/:contactId", {
        schema: {
            params: z.object({
                contactId: z.string().transform(Number)
            })
        }
    },async (request, reply) => {
        const {contactId} = request.params;
        const updatedContact = await UpdateContactRoute(contactId);
    })
}