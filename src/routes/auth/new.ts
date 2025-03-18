import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { sendCodeToUser } from "../../functions/send-code-to-user";

export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/auth/user",
		{ schema: { body: z.object({ name: z.string(), phone: z.string() }) } },
		async (request, reply) => {
			const { name, phone } = request.body;
			const result = await sendCodeToUser({ name, phone });
			// if (!setting) {
			//   throw new Error("Bad Request: missing your data");
			// }
			// if (setting.code !== code) {
			//   throw new Error("Bad Request: invalid code");
			// }
		},
	);
};
