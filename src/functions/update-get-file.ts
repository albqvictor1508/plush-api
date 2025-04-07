import { s3 } from "../common/storage/r2-config";
import { env } from "../common/env";
import type { UploadParams } from "../types/images";

const setFileUrl = (userId: string, photoType: string, fileName: string) => {
	return {
		fullPath: `https://${env.R2_BUCKET_NAME}.${env.R2_ENDPOINT}/${userId}/${photoType}/${fileName}`,
	};
};

export const uploadFile = async ({
	userId,
	photoType,
	fileName,
	fileContent,
}: UploadParams): Promise<string> => {
	const uniqueFileName = `${Date.now()}-${fileName}`;
	const { fullPath } = setFileUrl(userId, photoType, uniqueFileName);

	try {
		const params = {
			Bucket: env.R2_BUCKET_NAME,
			Key: fullPath,
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

export const getFileUrl = ({ fileName, photoType, userId }): string => {
	const { fullPath } = setFileUrl(fileName, photoType, userId);
	return fullPath;
};
