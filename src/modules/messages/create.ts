import { and, eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { s3 } from "src/common/bucket";
import { redis } from "src/common/cache";
import { ErrorCodes } from "src/common/error/codes";
import { ErrorMessages, ErrorStatus } from "src/common/error/messages";
import { Snowflake } from "src/common/snowflake";
import { db } from "src/db/client";
import { chatParticipants } from "src/db/schema/chat-participants";
import { chats } from "src/db/schema/chats";
import { users } from "src/db/schema/users";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/messages",
		{
			schema: {
				consumes: ["multipart/form-data"],
				body: z.object({
					chatId: z.string(),
					content: z.string().min(1),
					file: z.file(),
					userId: z.string(),
				}),
			},
		},
		async (request, reply) => {
			const { chatId, content, file, userId } = request.body;

			const [userExist] = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.id, userId));
			if (!userExist)
				return reply
					.code(ErrorStatus[ErrorCodes.UnknownUser])
					.send(ErrorMessages[ErrorCodes.UnknownUser]);

			const [chatExist] = await db
				.select({ id: chats.id })
				.from(chats)
				.innerJoin(chatParticipants, eq(chatParticipants.chatId, chats.id))
				.where(and(eq(chats.id, chatId), eq(chatParticipants.userId, userId)));

			if (!chatExist)
				return {
					error: ErrorCodes.UnknownChat,
					code: ErrorStatus[ErrorCodes.UnknownChat],
				};

			const id = (await new Snowflake().create()).toString();
			const data = {
				id,
				senderId: userId,
				sendedAt: new Date(),
				content,
				status: "sended",
				photo: "",
			};

			if (file) {
				const meta = s3.file(
					`chats/${id}/media/${userId}/Lume - ${data.sendedAt}`,
				);
				const buffer = await meta.arrayBuffer();

				await s3.write(await meta.json(), buffer);

				const url = meta.presign({
					acl: "public-read",
					expiresIn: 59 * 60 * 24,
				});
				data.photo = url;
			}

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
