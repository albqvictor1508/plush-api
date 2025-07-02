import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { parseCookie } from "../../utils/parse-cookie";
import { db } from "../../drizzle/client";
import { chats, chatParticipants } from "../../drizzle/schema";
import { and, eq } from "drizzle-orm";
import { saveAndBroadcastMessage } from "../../functions/messages/save-and-broadcast-message";

export const sendMessageRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/messages",
    {
      schema: {
        headers: z.object({
          cookie: z.string(),
        }),
        body: z.object({
          chatId: z.number(),
          content: z.string().min(1),
        }),
        response: {
          201: z.object({
            id: z.number(),
            chatId: z.number(),
            content: z.string(),
            status: z.string(),
            createdAt: z.date(),
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
      const { id: userId, email } = await parseCookie(request.headers.cookie || "");
      const { chatId, content } = request.body;

      if (!userId) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const [chat] = await db
        .select()
        .from(chats)
        .innerJoin(
          chatParticipants,
          and(
            eq(chatParticipants.chatId, chatId),
            eq(chatParticipants.userId, userId),
          ),
        );

      if (!chat?.chats || !chat?.chat_participants) {
        return reply.status(400).send({ error: "Chat not found or access denied" });
      }


      const newMessage = await saveAndBroadcastMessage({
        chatId,
        content,
        user: { id: userId as string, email },
        status: "sent",
      });

      return reply.status(201).send(newMessage);
    },
  );
};
