import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { parseCookie } from "../utils/parse-cookie";
import { db } from "../drizzle/client";
import { users } from "../drizzle/schema";
import { uploadFile } from "../functions/images/upload-file";
import { eq } from "drizzle-orm";
import chalk from "chalk";
import { z } from "zod";
import { PhotoType } from "../types/images";
import { getFileUrl } from "../functions/images/file-url";

const updateUserSchema = z.object({
	name: z.string(),
	email: z.string().email(),
});

export const updateUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.put("/api/user", async (request, reply) => {
		const { id: userId } = await parseCookie(request.headers.cookie || "");
		const data = await request.file();
		const { profileData } = data?.fields;
		const parsedData: { name: string; email: string } = JSON.parse(
			profileData.value,
		);
		updateUserSchema.parse(parsedData);
		const { name, email } = parsedData;
		const user = await db
			.update(users)
			.set({ name, email })
			.where(eq(users.id, userId))
			.returning({ name: users.name, email: users.email });

		if (!data) {
			return reply.status(200).send(user);
		}

		try {
			const fileBuffer = await data?.toBuffer();
			await uploadFile({
				userId,
				fileName: "profile-photo",
				fileContent: fileBuffer,
				photoType: PhotoType.PROFILE,
			});
		} catch (error) {
			throw new Error(chalk.bgCyanBright(`ERROR ON BUFFER IMAGE: ${error}`));
		}
		let fileUrl: string | null;
		try {
			fileUrl = await getFileUrl({
				fileName: "profile-photo",
				photoType: PhotoType.PROFILE,
				userId,
			});

			return reply.status(200).send({ user, fileUrl });
		} catch (error) {
			throw new Error(`ERROR ON GENERATE SIGNED URL: ${error}`);
		}
	});
};
