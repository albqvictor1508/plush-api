import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { createChat } from "../../functions/chat/create-chat.ts";
import { parseCookie } from "../../utils/parse-cookie";
import { db } from "../../drizzle/client";
import { chatParticipants, chats, users } from "../../drizzle/schema";
import { and, eq } from "drizzle-orm";

export const createChatRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/chats",
    {
      schema: {
        headers: z.object({
          cookie: z.string(),
        }),
        body: z.object({
          title: z.string().min(1).max(50),
          participantId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            id: z.number(),
            createdAt: z.date(),
            createdBy: z.string().uuid(),
            lastMessageAt: z.date().nullable(),
          }),
          400: z.object({
            error: z.string(),
          }),
          401: z.object({
            error: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { id } = await parseCookie(request.headers.cookie || "");
      const { title, participantId } = request.body;

      const [userExists] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, id));

      if (!userExists?.id) {
        return reply.status(400).send({ error: "user ID not founded" });
      }

      

      const [participantExists] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, participantId));

      if (!participantExists?.id) {
        return reply
          .status(400)
          .send({ error: "participant ID not founded" });
      }

      const chat = await createChat({ title, ownerId: id, participantsId: [participantId] });
      return reply.status(201).send(chat);
    },
  );
};
