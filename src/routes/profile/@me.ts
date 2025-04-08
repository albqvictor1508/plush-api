import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { PhotoType } from "../../types/images";
import { uploadFile } from "../../functions/images/upload-file";
import { parseCookie } from "../../utils/parse-cookie";
import chalk from "chalk";
import { db } from "../../drizzle/client";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const getProfileRoute: FastifyPluginAsyncZod = async (app) => {
	app.put("/api/@me", {}, async (request, reply) => {
		const { id: userId } = await parseCookie(request.headers.cookie || "");
		const data = await request.file();
		if (!data) {
			const [user] = await db
				.select({ name: users.name, email: users.email })
				.from(users)
				.where(eq(users.id, userId));

			return reply.status(200).send(user);
		}
		const { profileData } = data.fields;
		let parsedData: { name: string; email: string };

		try {
			parsedData = JSON.parse(profileData?.value);
			const { name, email } = parsedData;
		} catch (error) {
			throw new Error(chalk.bgGreen(`ERROR ON PARSE DATA: ${error}`));
		}
		const [user] = await db
			.select({ name: users.name, email: users.email })
			.from(users)
			.where(eq(users.id, userId));

		try {
			//por agora aceitar qualquer merda, mas dps quero filtrar por mimetype
			const fileBuffer = await data?.toBuffer();

			const fileUrl = await uploadFile({
				userId,
				fileName: data.filename || "profile-photo",
				fileContent: fileBuffer,
				photoType: PhotoType.PROFILE,
			});

			return reply.status(200).send({ user, photo: fileUrl });
		} catch (error) {
			throw new Error(chalk.bgCyan(`ERROR TO ADD IMAGE ON STORAGE: ${error}`));
		}
	});
};
