import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { parseCookie } from "../../utils/parse-cookie";

export const deleteMessageRoute: FastifyPluginAsyncZod = async (app) => {
	app.delete(
		"/api/messages/:userId",
		{
			schema: {
				params: z.object({ userId: z.string() }),
			},
		},
		async (request, response) => {
			const { id } = await parseCookie(request.headers.cookie || "");
		},
	);
};
