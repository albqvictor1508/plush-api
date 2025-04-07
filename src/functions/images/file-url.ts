import { env } from "../../common/env";
import { checkFileExists } from "./upload-file";

export const getFileUrl = ({ fileName, photoType, userId }): string | null => {
	const fullPath = `https://${env.R2_BUCKET_NAME}.${env.R2_ENDPOINT}/${userId}/${photoType}/${fileName}`;
	if (!checkFileExists(fileName)) return null;
	return fullPath;
};
