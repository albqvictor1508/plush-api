import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { uploadFile } from "../../functions/update-get-file";
import { PhotoType } from "../../types/images";

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
			const data = await request.file();
			if (!data) throw new Error("Missing multipart file (photo)");
			const { userId, profileData } = data.fields;
			let parsedData;
			try {
				parsedData = JSON.parse(profileData?.value);
			} catch (error) {}

			const file = await uploadFile({
				userId: userId as string,
				fileName: "salve",
				fileContent: "salve",
				photoType: PhotoType.PROFILE,
			});
		},
	);
};
