import { env } from "../../common/env";
import { s3 } from "../../common/storage/r2-config";
import type { UploadParams } from "../../types/images";

export const checkFileExists = async (fullPath: string): Promise<boolean> => {
	try {
		await s3
			.headObject({
				Bucket: env.R2_BUCKET_NAME,
				Key: fullPath,
			})
			.promise();
		return true;
	} catch (error) {
		if (error.code === "NotFound" || error.code === "NoSuchKey") return false;
		throw error;
	}
};

export const uploadFile = async ({
	userId,
	photoType,
	fileName,
	fileContent,
}: UploadParams): Promise<string> => {
	const fullPath = `${userId}/${photoType}/${fileName}`;

	try {
		const params = {
			Bucket: env.R2_BUCKET_NAME,
			Key: fullPath as string,
			Body: fileContent,
			ACL: "private",
		};

		await s3.upload(params).promise();
		return fullPath;
	} catch (error) {
		console.error("Erro no upload do arquivo:", error);
		throw new Error("Falha ao fazer upload do arquivo.");
	}
};
