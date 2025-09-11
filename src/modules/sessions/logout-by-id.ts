import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/sessions/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
    },
  );
};
