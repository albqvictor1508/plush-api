import { env } from "./env";

const { S3Client } = Bun;
const { APP_NAME, BUCKET_ACCESS_KEY_ID, BUCKET_SECRET_ACCESS_KEY } = env;

//tenho que bolar a estrutura de forma com que eu sempre saiba: quem
//enviou(userId), aonde enviou(chatId), se é original ou réplica(/originals)

export const getChatMedia = (chatId: string) => {
	return `/chats/${chatId}/${APP_NAME}-${new Date()}.webp`;
};

export const getMessageMedia = () => {
	return `/chats/`;
};

export const getUserMedia = (userId: string) => {
	return `${userId}/Lume - profile.webp`;
};

export const s3cli = new S3Client({
	accessKeyId: BUCKET_ACCESS_KEY_ID,
	secretAccessKey: BUCKET_SECRET_ACCESS_KEY,
	bucket: APP_NAME,
});
