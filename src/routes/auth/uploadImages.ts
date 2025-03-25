import { FastifyInstance } from "fastify";
import s3 from "../../common/r2storage/r2Config";

export async function uploadFileRoute(app: FastifyInstance) {
    app.post("/upload", async (request, reply) => {
        const data = await request.file(); 
        if (!data) {
            return reply.status(400).send({ error: "Nenhum arquivo enviado" });
        }

        // criando um buffer do arquivo
        const fileBuffer = await data.toBuffer();

        // upload para Cloudflare R2
        const uploadParams = {
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: data.filename, // Nome do arquivo
            Body: fileBuffer,
            ContentType: data.mimetype, // Tipo do arquivo
        };

        try {
            await s3.upload(uploadParams).promise();
            return reply.status(200).send({ message: "Upload concluído!", file: data.filename });
        } catch (error) {
            return reply.status(500).send({ error: "Erro ao enviar arquivo", details: error });
        }
    });
}
