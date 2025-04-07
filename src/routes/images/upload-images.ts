import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { env } from "../../common/env";
import { s3 } from "../../functions/r2-service";

export const uploadFileRoutee: FastifyPluginAsyncZod = async (app) => {
	app.post("/api/images", async (request, reply) => {
		if (!request.isMultipart()) {
			if (!request.isMultipart()) {
				return reply
					.status(400)
					.send({ error: "Requisição inválida. Use multipart/form-data" });
			}

			const parts = request.parts(); // captura os arquivos da requisição multipart
			let data;

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

			// upload para Cloudflare R2
			const uploadParams = {
				Bucket: env.R2_BUCKET_NAME,
				Key: data.filename,
				Body: fileBuffer,
				ContentType: data.mimetype,
			};

			try {
				// corrigido para utilizar promise() do SDK do AWS
				await s3.upload(uploadParams).promise(); // utilizando promise() para aguardar o upload/ sem ele a rota não funciona
				return reply
					.status(200)
					.send({ message: "Upload concluído!", file: data.filename });
			} catch (error) {
				console.error("Erro ao enviar arquivo:", error);
				return reply
					.status(500)
					.send({ error: "Erro ao enviar arquivo", details: error });
			}
		}
	});
};

export async function uploadFileRoute(app: FastifyInstance) {
	app.post("/upload", async (request, reply) => {
		// "https://localhost:3333/upload" para fazer a requisição
		// verifica se a requisição contém multipart/form-data
	});
}
