import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { parseCookie } from "../utils/parse-cookie";
import { db } from "../drizzle/client";
import { users } from "../drizzle/schema";
import { uploadFile } from "../functions/images/upload-file";
import { eq } from "drizzle-orm";
import chalk from "chalk";
import { z } from "zod";

const updateUserSchema = z.object({
	name: z.string(),
	email: z.string().email(),
});

export const updateUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.put("/api/user", async (request, reply) => {
		const { id: userId } = await parseCookie(request.headers.cookie || "");
		const data = await request.file();
		const { profileData } = data?.fields;
		let parsedData: { name: string; email: string };

		if (!data) {
			const parsedData: { name: string; email: string } = JSON.parse(
				profileData.value,
			);
			updateUserSchema.parse(parsedData);
			const { name, email } = parsedData;

			await db; //update no user

			return reply.status(200).send(user);
		}

		try {
			const salve = "salve";
		} catch (error) {
			throw new Error(chalk.bgCyanBright(`ERROR: ${error}`));
		}

		const fileBuffer = await data?.toBuffer();
		await uploadFile({
			userId,
			fileName: "profile-photo",
			fileContent: fileBuffer,
			photoType: PhotoType.PROFILE,
		});
	});
};
