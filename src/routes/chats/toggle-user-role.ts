import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { parseCookie } from "../../utils/parse-cookie";
import { toggleUserRole } from "../../functions/toggle-user-role";

export const toggleUserRoleRoute: FastifyPluginAsyncZod = async (app) => {
	app.post("/api/admin", async (request, reply) => {
		const { id: userId } = await parseCookie(request.headers.cookie || "");

		await toggleUserRole({ userId });
		//setar um intervalo de tempo entre uma requisição e outra (pro cara n ta colocando e tirando o admin direto)
	});
};
