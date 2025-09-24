import type { MultipartFile } from "@fastify/multipart";
import { S3Client } from "bun";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { EventType } from "src/@types/ws";
import { getChatAvatar, s3 } from "src/common/bucket";
import { redis } from "src/common/cache";
import { Snowflake } from "src/common/snowflake";
import { STREAM_KEY } from "src/common/ws";
import { db } from "src/db/client";
import { users } from "src/db/schema/users";
import { createChat } from "src/functions/chats/create";
import z from "zod";

const fields: Record<string, any> = {};

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
			const id = (await new Snowflake().create()).toString();
			if (file) {
				path = getChatAvatar(id);
				const buffer = await file.toBuffer();
				s3cli.file(path);
			}

			await s3.write(await meta.json(), buffer);
			const url = meta.presign({
				acl: "public-read", //LER SOBRE ISSO
				expiresIn: 60 * 60 * 24,
			});

			const data = { id, avatar: url, ...request.body };
			const [response] = await Promise.all([
				createChat(data),
				redis.send("XADD", [
					STREAM_KEY,
					"*",
					"type",
					EventType.CHAT_CREATED,
					"body",
					JSON.stringify(data),
				]),
			]);

			if (typeof response === "object" && "error" in response)
				return reply.code(response.code as number).send(response.error);

			return reply.code(201);
		},
	);
};
