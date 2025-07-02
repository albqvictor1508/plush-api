import AWS from "aws-sdk";
import { env } from "../env";

export const s3 = new AWS.S3({
	endpoint: env.R2_ENDPOINT,
	accessKeyId: env.R2_ACCESS_KEY,
	secretAccessKey: env.R2_SECRET_KEY,
	signatureVersion: "v4",
});
