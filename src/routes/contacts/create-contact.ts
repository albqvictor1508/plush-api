import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { parseCookie } from "../../utils/parse-cookie";
import { createContact } from "../../functions/contacts/create-contact";

export const CreateContactRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/contacts",
		{
			schema: {
				body: z.object({
					name: z.string(),
					email: z.string().email(),
					photoUrl: z.optional(z.string().url()),
				}),
				// response: {
				// 	201: z.object({
				// 		id: z.number(),
				// 		name: z.string(),
				// 		email: z.string().email(),
				// 		userId: z.string().uuid(),
				// 		photoUrl: z.optional(z.string().url()),
				// 		createdAt: z.date(),
				// 		updatedAt: z.date(),
				// 	}),
				// },
			},
		},
		async (request, reply) => {
			const { email, name, photoUrl } = request.body;
			const { id: userId } = await parseCookie(request.headers.cookie || "");
			const contact = await createContact({
				name,
				email,
				userId,
				photoUrl,
				isFixed: false,
			});
			return reply.status(201).send(contact);
		},
	);
};
