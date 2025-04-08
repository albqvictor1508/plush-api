import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { PhotoType } from "../../types/images";
import { uploadFile } from "../../functions/images/upload-file";
import { parseCookie } from "../../utils/parse-cookie";
import chalk from "chalk";

export const getProfileRoute: FastifyPluginAsyncZod = async (app) => {
	app.put(
		"/api/@me",
		{
			schema: {
				body: z.object({
					name: z.string(),
					email: z.string().email(),
				}),
			},
		},
		async (request, reply) => {
			const { id: userId } = await parseCookie(request.headers.cookie || "");
			const data = await request.file();
			if (!data) throw new Error("Missing multipart file (photo)");
			const { profileData } = data.fields;
			let parsedData: { name: string; email: string };

			try {
				parsedData = JSON.parse(profileData?.value);
				console.log(chalk.yellow(parsedData));

				return reply.status(200).send({ test: "test", parsedData });
			} catch (error) {
				throw new Error(`Error to parse profile data: ${error}`);
			}

			const file = await uploadFile({
				userId: userId,
				fileName: "salve",
				fileContent: "salve",
				photoType: PhotoType.PROFILE,
			});
		},
	);
};
