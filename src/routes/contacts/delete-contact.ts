import {FastifyTypeProviderZod} from "fastify-type-provider-zod"
import {z} from "zod";

export const DeleteContactRoute: FastifyTypeProviderZod async (app) => {
  app.delete("api/contacts", {
    schema: {
      body: z.object({
        email: z.string().email()
      })
    }
  }, async (request, reply) => {
    const {id: userId} = await parseCookie(request.headers.cookie || "");
    const {email} = request.body;

    return reply.status(200);
  }) 
}
