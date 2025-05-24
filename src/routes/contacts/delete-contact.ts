import {FastifyPluginAsyncZod} from "fastify-type-provider-zod"
import {z} from "zod";
import {parseCookie} from "../../utils/parse-cookie"
import { DeleteContact } from "../../functions/contacts/delete-contact";

export const DeleteContactRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete("api/contacts", {
    schema: {
      body: z.object({
        email: z.string().email()
      })
    }
  }, async (request, reply) => {
    const {id: userId} = await parseCookie(request.headers.cookie || "");
    const {email} = request.body;
    
    if(!await DeleteContact(email)) return reply.status(400).send("this contact not exists");
    return reply.status(200);
  }) 
}
