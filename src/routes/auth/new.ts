import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { sendCodeToUser } from "../../functions/send-code-to-user";
import { db } from "../../drizzle/client";
import { users } from "../../drizzle/schema/users";
import { eq } from "drizzle-orm";

export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/auth/user",
		{ schema: { body: z.object({ name: z.string(), phone: z.string() }) } },
		async (request, reply) => {
			const { name, phone } = request.body;
			const userAlreadyExists = await db
				.select()
				.from(users)
				.where(eq(users.phone, phone));

			if (userAlreadyExists) return "";

			const result = await sendCodeToUser({ name, phone });
			const token = app.jwt.sign({});
			reply.setCookie("jwt", token).send({ result });
			// if (!setting) {
			//   throw new Error("Bad Request: missing your data");
			// }
			// if (setting.code !== code) {
			//   throw new Error("Bad Request: invalid code");
			// }
		},
	);
};
