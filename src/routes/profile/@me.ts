import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { PhotoType } from "../../types/images";
import {
	checkFileExists,
	uploadFile,
} from "../../functions/images/upload-file";
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

		let fileUrl: string | null = null;
		const fileName = "profile-photo";
		const fileExists = await checkFileExists(
			`${userId}/${PhotoType.PROFILE}/${fileName}`,
		);
		try {
			if (fileExists) {
				fileUrl = await getFileUrl({
					fileName,
					photoType: PhotoType.PROFILE,
					userId,
				});
			}

			return reply.status(200).send({ user, fileUrl });
		} catch (error) {
			throw new Error(chalk.bgCyan(`ERROR TO ADD IMAGE ON STORAGE: ${error}`));
		}
	});
};
