import { env } from "./env";

const { S3Client } = Bun;
const { APP_NAME, BUCKET_ACCESS_KEY_ID, BUCKET_SECRET_ACCESS_KEY } = env;

//webp e jpg

export const getChatAvatar = (chatId: string) => {
	return `/chats/${chatId}/${APP_NAME}-${new Date()}.webp`;
};

export const getUserAvatar = (userId: string) => {
	return `${userId}/Lume - profile.webp`;
};

export const s3 = new S3Client({
	accessKeyId: BUCKET_ACCESS_KEY_ID,
	secretAccessKey: BUCKET_SECRET_ACCESS_KEY,
	bucket: APP_NAME,
});
