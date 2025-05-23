import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { uploadFile } from "../functions/images/upload-file";
import { parseCookie } from "../utils/parse-cookie";
import { PhotoType } from "../types/images";
import { z } from "zod";
import { getFileUrl } from "../functions/images/file-url";

export const uploadImage: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/images",
		{ schema: { body: z.object({ description: z.nullable(z.string()) }) } },
		async (request, reply) => {
			const { id: userId } = await parseCookie(request.headers.cookie || "");
			const parts = request.parts();
			let fileName: string | undefined;
			let fileBuffered: Buffer<ArrayBufferLike> | undefined;

			try {
				for await (const part of parts) {
					if (part.type === "file") {
						fileBuffered = await part.toBuffer();
						fileName = part.filename;
						await uploadFile({
							userId,
							photoType: PhotoType.IMAGE,
							fileName: fileName,
							fileContent: fileBuffered,
						});
					}
				}
			} catch (error) {
				return reply.send(400).send(`ERROR TO UPLOAD FILE: ${error}`);
			}
			if (!fileName || !fileBuffered)
				return reply.status(400).send("image not sended.");

			const fileUrl = await getFileUrl({
				fileName: fileName,
				photoType: PhotoType.IMAGE,
				userId,
			});
		},
	);
};
