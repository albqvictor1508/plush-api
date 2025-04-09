import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../../drizzle/client";
import { parseCookie } from "../../utils/parse-cookie";
import { chatParticipants } from "../../drizzle/schema";

export const toggleUserRoleRoute: FastifyPluginAsyncZod = async (app) => {
	app.post("/api/admin", async (request, reply) => {
		const { id: userId } = await parseCookie(request.headers.cookie || "");
		//setar um intervalo de tempo entre uma requisição e outra (pro cara n ta colocando e tirando o admin direto)
	});
};
