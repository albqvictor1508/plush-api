import type { MultipartFile } from "@fastify/multipart";
import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { s3cli } from "src/common/bucket";
import { redis } from "src/common/cache";
import { ErrorCodes } from "src/common/error/codes";
import { ErrorMessages, ErrorStatus } from "src/common/error/messages";
import { Snowflake } from "src/common/snowflake";
import { db } from "src/db/client";
import { chatParticipants } from "src/db/schema/chat-participants";
import { chats } from "src/db/schema/chats";
import { users } from "src/db/schema/users";
import z from "zod";

interface CreateMessageOptions {
	id: string;
	photo: string;
	chatId: string;
	senderId: string;
	status: "sended" | "delivered" | "viewed";
	content: string;
	sendedAt: Date;
}

const createMessageSchema = z.object({
	chatId: z.string(),
	senderId: z.string(),
	status: z.enum(["sended", "delivered", "viewed"]),
	content: z.string(),
});

const fields: Record<string, any> = {};

export const route: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/messages",
		{
			schema: {
				summary: "Create message route",
				tags: ["messages"],
				consumes: ["multipart/form-data"],
			},
		},
		async (request, reply) => {
			let file: MultipartFile;
			let path = "utils/default-photo.webp";

			const parts = request.parts();

			for await (const p of parts) {
				if (p.type !== "file") {
					fields[p.fieldname] = p.value;
					continue;
				}

				file = p;
			}

			const id = (await new Snowflake().create()).toString();

			//@ts-expect-error
			const data: CreateMessageOptions = {
				id,
				photo: "",
				sendedAt: new Date(),
				...fields,
			};

			if (!createMessageSchema.safeParse(data))
				return reply.status(400).send("Bad Credentials");

			const { chatId, senderId } = data;
			const [userExist] = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.id, senderId));

			if (!userExist)
				return reply
					.code(ErrorStatus[ErrorCodes.UnknownUser])
					.send(ErrorMessages[ErrorCodes.UnknownUser]);

			const [chatExist] = await db
				.select({ id: chats.id })
				.from(chats)
				.innerJoin(chatParticipants, eq(chatParticipants.chatId, chats.id))
				.where(
					and(eq(chats.id, chatId), eq(chatParticipants.userId, senderId)),
				);

			if (!chatExist)
				return {
					error: ErrorCodes.UnknownChat,
					code: ErrorStatus[ErrorCodes.UnknownChat],
				};

			if (file) {
				const buffer = await file.toBuffer();
				await s3cli.file(path).write(buffer);
			}

			data.photo = s3cli.presign(path);
			await redis.send("XADD", [
				`chat:${id}`,
				"*",
				"data",
				JSON.stringify(data),
			]);
			return reply.code(200);
		},
	);
};
