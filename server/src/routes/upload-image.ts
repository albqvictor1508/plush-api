import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { uploadFile } from "../functions/images/upload-file";
import { parseCookie } from "../utils/parse-cookie";
import { PhotoType } from "../types/images";
import { getFileUrl } from "../functions/images/file-url";
import { db } from "../drizzle/client";
import { messages } from "../drizzle/schema";
import type { MultipartFile } from "@fastify/multipart";

export const uploadImage: FastifyPluginAsyncZod = async (app) => {
	app.post("/api/messages/images", {}, async (request, reply) => {
		const files: MultipartFile[] = [];
		const { id: userId } = await parseCookie(request.headers.cookie || "");
		const parts = request.parts();
		let fileName: string | undefined;
		let chatId: number | unknown;
		let content: string | unknown;

		try {
			for await (const part of parts) {
				if (part.type === "file") {
					const fileBuffered = await part.toBuffer();
					files.push(part);
					fileName = await uploadFile({
						userId,
						photoType: PhotoType.IMAGE,
						fileName: `plush_photo - ${new Date()}`,
						fileContent: fileBuffered,
					});
				}

				if (part.type === "field") {
					if (part.fieldname === "chatId") {
						chatId = part.value;
					}
					if (part.fieldname === "content") {
						content = part.value;
					}
				}
			}
			if (!chatId) {
				return reply.status(400).send("Missing chatId");
			}

			if (files.length > 0) {
				for (const file of files) {
					const fileUrl = await getFileUrl({
						photoType: PhotoType.IMAGE,
						userId,
						fileName: fileName as string,
					});
					const message = await db
						.insert(messages)
						.values({
							userId: userId as string,
							chatId: chatId as number,
							content: (content as string) || "",
							status: "sent",
							fileUrl,
						})
						.returning();
					return reply.status(201).send(message);
				}
			}
		} catch (error) {
			return reply.send(500).send(`ERROR TO UPLOAD FILE: ${error}`);
		}
	});
};
