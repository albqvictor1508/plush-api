import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { uploadFile } from "../../functions/images/upload-file";

export const uploadFileRoute: FastifyPluginAsyncZod = async (app) => {
	app.post("/api/images", async (request, reply) => {
		if (!request.isMultipart()) {
			if (!request.isMultipart()) {
				return reply
					.status(400)
					.send({ error: "Requisição inválida. Use multipart/form-data" });
			}

			const parts = request.parts(); // captura os arquivos da requisição multipart
			let data: unknown;

			for await (const part of parts) {
				if (part.type === "file") {
					data = part;
					break; // pega o primeiro arquivo enviado
				}
			}

			if (!data) {
				return reply.status(400).send({ error: "Nenhum arquivo enviado" });
			}
			// criando um buffer do arquivo
			const fileBuffer = await data.toBuffer();

			const fileUrl = await uploadFile({
				userId,
				fileContent,
				fileName,
				photoType,
			});
		}
	});
};
