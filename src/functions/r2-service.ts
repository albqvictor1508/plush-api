import { s3 } from "../common/storage/r2-config";
import { env } from "../common/env";
import type { UploadParams } from "../types/images";

// Interface para os parâmetros de upload

// Função para upload de arquivo
export const uploadFile = async ({
	fileName,
	fileContent,
}: UploadParams): Promise<string> => {
	try {
		const params = {
			Bucket: env.R2_BUCKET_NAME,
			Key: fileName,
			Body: fileContent,
			ACL: "private",
		};

		const result = await s3.upload(params).promise();
		return result.Location; // Retorna a URL do arquivo armazenado
	} catch (error) {
		console.error("Erro no upload do arquivo:", error);
		throw new Error("Falha ao fazer upload do arquivo.");
	}
};

// Função para gerar URL do arquivo armazenado
export const getFileUrl = (fileName: string): string => {
	return `https://${env.R2_BUCKET_NAME}.${env.R2_ENDPOINT}/${fileName}`;
};
