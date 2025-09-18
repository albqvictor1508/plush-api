import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

//rota multipart

export const route: FastifyPluginAsyncZod = async (app) => {
  app.post("/chats", {
    websocket: true,
    schema: {
      body: z.object({
        ownerId: z.string(),
        title: z.string(),
      }),
    },
  });
};
