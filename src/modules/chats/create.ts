import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

//rota multipart

export const route: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/chats",
    {
      schema: {
        consumes: ["multipart/form-data"],
        body: z.object({
          ownerId: z.string(),
          title: z.string(),
          avatar: z.file(),
          description: z.string(),
          participants: z.set(z.string()).min(1),
        }),
      },
    },
    async (request, reply) => {
      const { avatar, description, ownerId, participants, title } =
        request.body;

      //@ts-expect-error
      const { user } = app;
      const { id } = user;
    },
  );
};
