import chalk from "chalk";
import { checkFileExists } from "./upload-file";
import { s3 } from "../../common/storage/r2-config";
import { env } from "../../common/env";

export const getFileUrl = async ({
	fileName,
	photoType,
	userId,
}): Promise<string | null> => {
	const fullPath = `${userId}/${photoType}/${fileName}`;
	try {
		await checkFileExists(fullPath);

		const signedUrl = await s3.getSignedUrlPromise("getObject", {
			Bucket: env.R2_BUCKET_NAME,
			Key: fullPath,
			Expires: 3600, //pensar nisso depois
		});

		return signedUrl;
	} catch (error) {
		throw new Error(chalk.bgGray(`ERROR TO GENERATE A SIGNED URL: ${error}`));
	}
};
