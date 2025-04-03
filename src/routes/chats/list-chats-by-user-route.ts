import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { parseCookie } from "../../utils/parse-cookie";

export const listChatsByUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/api/chats", {}, async (request, reply) => {
		const user = await parseCookie(request.headers.cookie || "");
	});
};
