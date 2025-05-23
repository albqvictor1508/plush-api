import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { uploadFile } from "../functions/images/upload-file";
import { parseCookie } from "../utils/parse-cookie";
import { PhotoType } from "../types/images";
import { z } from "zod";

export const uploadImage: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/images",
		{ schema: { body: z.object({ description: z.nullable(z.string()) }) } },
		async (request, reply) => {
			const { id } = await parseCookie(request.headers.cookie || "");
			const parts = request.parts();
			for await (const part of parts) {
				if (part.type === "file") {
					const fileBuffered = await part.toBuffer();
					await uploadFile({
						userId: id,
						photoType: PhotoType.IMAGE,
						fileName: part.filename,
						fileContent: fileBuffered,
					});
				}
			}
		},
	);
};
