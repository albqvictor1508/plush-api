import { eq, and } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "src/db/client";
import { chatParticipants } from "src/db/schema/chat-participants";
import { chats } from "src/db/schema/chats";
import { users } from "src/db/schema/users";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    "/chats/:id",
    {
      schema: {
        params: z.object({
          id: z.string(),
        }),
        querystring: z.object({
          userId: z.optional(z.string()),
        }),
      },
    },
    async (request, reply) => {
      let userId: string;
      const { id } = request.params;
      userId = request.query.userId || "";

      if (!userId) {
        //@ts-expect-error
        const { user } = app;
        userId = user.id;
      }

      //WARN: analisar essa tranqueira toda aq

      //const [user] = await db.select().from(users).where(eq(users.id, userId));

      const [adm] = await db
        .select({ id: chatParticipants.userId })
        .from(chatParticipants)
        .where(
          and(
            eq(chatParticipants.userId, userId),
            eq(chatParticipants.role, "admin"),
          ),
        );
      const [chat] = await db
        .select({ id: chats.id })
        .from(chats)
        .where(and(eq(chats.id, id), eq(chats.ownerId, userId)));
      if (!adm || !chat)
        return reply
          .code(400)
          .send("the user must to be admin or owner to delete chat"); //WARN: tratar erro
    },
  );
};
