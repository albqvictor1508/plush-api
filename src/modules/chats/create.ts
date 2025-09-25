import type { MultipartFile } from "@fastify/multipart";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { EventType } from "src/@types/ws";
import { getChatMedia, s3cli } from "src/common/bucket";
import { redis } from "src/common/cache";
import { Snowflake } from "src/common/snowflake";
import { STREAM_KEY } from "src/common/ws";
import { db } from "src/db/client";
import { files } from "src/db/schema/files";
import { users } from "src/db/schema/users";
import { createChat } from "src/functions/chats/create";
import z from "zod";

type FileExtension = "pdf" | "docx" | "jpg" | "png" | "webp" | "jpeg";
const fields: Record<string, any> = {};

const createChatSchema = z.object({
	title: z.string(),
	ownerId: z.string(),
	description: z.string(),
	extension: z.enum(["df"]),
});

export const route: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/chats",
		{
			schema: {
				summary: "Create chat route.",
				tags: ["chats"],
				consumes: ["multipart/form-data"],
			},
		},
		async (request, reply) => {
			let file: MultipartFile | null = null;
			let path = "http://";

			const parts = request.parts();
			//const { user } = app;
			//const { id: ownerId } = user;
			for await (const part of parts) {
				if (part.type !== "file") {
					fields[part.fieldname] = part.value;
					continue;
				}

				file = part;
			}
			if (!createChatSchema.safeParse(fields))
				return reply.code(400).send("Bad Credentials");

			const { title, description, ownerId } = fields;

			const [user] = await db
				.select({ id: users.id })
				.from(users)
				.where(eq(users.id, ownerId));
			if (!user) return reply.code(404).send("Unknown User");

			const chatId = (await new Snowflake().create()).toString();
			const fileId = (await new Snowflake().create()).toString();
			if (file) {
				path = getChatMedia(chatId, fileId, "profile", file.mimetype);
				const buffer = await file.toBuffer();

				await db.insert(files).values({
					id: fileId,
					extension: file.mimetype as FileExtension,
					sendedAt: new Date(),
				});

				s3cli.file(path).write(buffer);
			}

			const url = s3cli.presign(path);

			const data = { chatId, avatar: url, ...fields };

			//@ts-expect-error
			const res = await createChat(data);
			if (typeof res === "object" && "error" in res)
				return reply.code(res.code as number).send(res.error);

			redis.send("XADD", [
				STREAM_KEY,
				"*",
				"type",
				EventType.CHAT_CREATED,
				"body",
				JSON.stringify(data),
			]);

			return reply.code(201);
		},
	);
};
