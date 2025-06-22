import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { parseCookie } from "../../utils/parse-cookie";
import { listChatsByUser } from "../../functions/chat/list-chats-by-user.ts";

export const listChatsByUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.get("/api/chats", async (request, reply) => {
    const { id } = await parseCookie(request.headers.cookie || "");
    const { chat } = await listChatsByUser(id);
    reply.status(200).send(chat);
  });
};
