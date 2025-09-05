import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
  app.get("/health", {
    schema: {
      response: {
        200: z.string()
      }
    }
  }, async (_, reply) => {
    return reply.status(200).send("OK")
  })
}
