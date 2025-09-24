import { env } from "./env";

const { S3Client } = Bun;
const { APP_NAME, BUCKET_ACCESS_KEY_ID, BUCKET_SECRET_ACCESS_KEY } = env;
const DEFAULT_EXT = "webp";

export const getChatMedia = (
  chatId: string,
  fileId: string,
  type: "profile" | "banner" | "attach",
  ext: string = DEFAULT_EXT,
) => {
  return `/chats/${chatId}/uploads/${type}/Lume -${fileId}.${ext}`;
};

export const getMessageMedia = (
  chatId: string,
  fileId: string,
  ext: string = DEFAULT_EXT,
) => {
  return `/chats/${chatId}/uploads/photo-${fileId}.${ext}`;
};

export const getUserMedia = (
  userId: string,
  photoId: string,
  type: "profile" | "banner",
  ext: string = DEFAULT_EXT,
) => {
  return `users/${userId}/uploads/${type}/Lume - ${photoId}.${ext}`;
};

export const s3cli = new S3Client({
  accessKeyId: BUCKET_ACCESS_KEY_ID,
  secretAccessKey: BUCKET_SECRET_ACCESS_KEY,
  bucket: APP_NAME,
});
