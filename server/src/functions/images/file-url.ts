import chalk from "chalk";
import { checkFileExists } from "./upload-file";
import { s3 } from "../../common/storage/r2-config";
import { env } from "../../common/env";
import type { GetFileUrlParams } from "../../types/images";

export const getFileUrl = async ({
	fileName,
	photoType,
	userId,
}: GetFileUrlParams): Promise<string | null> => {
	const fullPath = `${userId}/${photoType}/${fileName}`;
	try {
		const file = await checkFileExists(fullPath);
		if (!file) return null;

		const signedUrl = s3.getSignedUrl("getObject", {
			Bucket: env.R2_BUCKET_NAME,
			Key: fullPath,
		});
		return signedUrl;
	} catch (error) {
		throw new Error(chalk.gray(`ERROR ON GENERATE URL: ${error}`));

	}
};
