import { and, eq } from "drizzle-orm";
import { s3 } from "src/common/bucket";
import { redis } from "src/common/cache";
import { ErrorCodes } from "src/common/error/codes";
import { ErrorStatus } from "src/common/error/messages";
import { Snowflake } from "src/common/snowflake";
import { db } from "src/db/client";
import { chatParticipants } from "src/db/schema/chat-participants";
import { chats } from "src/db/schema/chats";
import { users } from "src/db/schema/users";

type MessageOptions = {
	chatId: string;
	content: string;
	photo?: File;
	userId: string;
};
export const createMessage = async (body: MessageOptions) => {};
