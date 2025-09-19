import { eq, and, or } from "drizzle-orm";
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

      const [chat] = await db
        .select({ id: chats.id })
        .from(chats)
        .where(eq(chats.id, id));
      if (!chat) return reply.code(400).send("invalid chat id"); //WARN: tratar erro

      const [user] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, userId));
      if (!user) return reply.code(400).send("invalid user id"); //WARN: tratar erro

      const [userCanDeleteChat] = await db
        .select({ id: chatParticipants.userId })
        .from(chatParticipants)
        .where(
          and(
            eq(chatParticipants.userId, userId),
            or(
              eq(chatParticipants.role, "admin"),
              eq(chatParticipants.role, "owner"),
            ),
          ),
        );

      if (!userCanDeleteChat)
        return reply
          .code(400)
          .send("the user must to be admin or owner to delete chat"); //WARN: tratar erro
    },
  );
};
