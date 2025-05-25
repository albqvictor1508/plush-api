import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {z} from "zod";
import { updateContact } from "../../functions/contacts/update-contact";

export const UpdateContactRoute: FastifyPluginAsyncZod = async(app) => {
    app.put("/api/contacts/:contactId", {
        schema: {
            params: z.object({
                contactId: z.string().transform(Number)
            }),
            body: z.object({
                name: z.string().optional(),
                email: z.string().email().optional(),
                photoUrl: z.string().url().optional(),
                isFixed: z.boolean().optional()
            })
        }
    },async (request, reply) => {
        const {name,email,isFixed,photoUrl} = request.body;
        const {contactId} = request.params;
        const updatedContact = await updateContact(contactId, {name, email, photoUrl, isFixed});
    })
}