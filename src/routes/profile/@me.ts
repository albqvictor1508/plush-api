import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PhotoType } from "../../types/images";
import { parseCookie } from "../../utils/parse-cookie";
import chalk from "chalk";
import { db } from "../../drizzle/client";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { getFileUrl } from "../../functions/images/file-url";

export const getProfileRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/api/@me", async (request, reply) => {
		const { id: userId } = await parseCookie(request.headers.cookie || "");

		const [user] = await db
			.select({ name: users.name, email: users.email })
			.from(users)
			.where(eq(users.id, userId));

		try {
			const fileUrl = await getFileUrl({
				userId,
				photoType: PhotoType.PROFILE,
				fileName: "profile-photo",
			});

			return reply.status(200).send({ ...user, fileUrl });
		} catch (error) {
			return reply.status(500).send(`ERROR TO ADD IMAGE ON STORAGE: ${error}`);
		}
	});
};
