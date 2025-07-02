import { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { z } from "zod"
import { db } from "../../drizzle/client";
import { and, eq, exists } from "drizzle-orm";
import { chatParticipants, chats } from "../../drizzle/schema";

export const LeaveGroupRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete("/api/groups/:chatId/leave/:participantId", {
    schema: {
      params: z.object({
        chatId: z.string().transform(Number),
        participantId: z.string().uuid()
      })
    }
  }, async (request, reply) => {
    const { chatId, participantId } = request.params;
    const [groupExists] = await db
      .select({ exists: exists(chatParticipants) })
      .from(chatParticipants)
      .innerJoin(chats, eq(chats.id, chatParticipants.chatId))
      .where(and(eq(chatParticipants.chatId, chatId), eq(chatParticipants.userId, participantId), eq(chats.chatType, "group")));

    if (!groupExists) return reply.status(404).send("This group not exists");

    await db.delete(chatParticipants).where(and(eq(chatParticipants.chatId, chatId), eq(chatParticipants.userId, participantId)));

    return reply.status(200);
  })
}
