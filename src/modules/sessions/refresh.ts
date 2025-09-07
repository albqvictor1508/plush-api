import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/refresh",
    {
      schema: {
        response: {
          200: z.void(),
        },
      },
    },
    async (request, reply) => {
      //salve
      const salve = "salve";
    },
  );
};
