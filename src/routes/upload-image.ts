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
		let fileBuffered: Buffer<ArrayBufferLike> | undefined;
		let chatId: number | unknown;
		let content: string | unknown;

		try {
			for await (const part of parts) {
				if (part.type === "file") {
					fileBuffered = await part.toBuffer();
					fileName = part.filename;
					files.push(part);
					await uploadFile({
						userId,
						photoType: PhotoType.IMAGE,
						fileName: fileName,
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
				if (!chatId) {
					return reply.status(400).send("Missing chatId");
				}

				// await db.insert(messages).values({ userId, chatId });
			}
		} catch (error) {
			return reply.send(400).send(`ERROR TO UPLOAD FILE: ${error}`);
		}
		//resolver isso aq, pq dps essa rota provavelmente vai virar rota padrão pra criar mensagem
		if (fileName || fileBuffered) {
			const fileUrl = await getFileUrl({
				fileName: fileName as string,
				photoType: PhotoType.IMAGE,
				userId,
			});

			const message = await db.insert(messages).values({
				userId: userId as string,
				status: "sent",
				chatId: chatId as number,
				content: content as string,
			});
		}
	});
};
