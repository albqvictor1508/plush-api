import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { uploadFile } from "../functions/images/upload-file";
import { parseCookie } from "../utils/parse-cookie";

export const uploadImage: FastifyPluginAsyncZod = async (app) => {
	app.post("/api/images", async (request, reply) => {
		const { id } = await parseCookie(request.headers.cookie || "");
		const files = request.files();
		for await (const file of files) {
			const fileBuffered = await file.toBuffer();
			await uploadFile(id);
		}
	});
};
