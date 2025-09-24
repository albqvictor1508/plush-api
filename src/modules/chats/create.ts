import type { MultipartFile } from "@fastify/multipart";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { EventType } from "src/@types/ws";
import { getChatAvatar, s3cli } from "src/common/bucket";
import { redis } from "src/common/cache";
import { Snowflake } from "src/common/snowflake";
import { STREAM_KEY } from "src/common/ws";
import { createChat } from "src/functions/chats/create";

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
				s3cli.file(path).write(buffer);
			}

			const url = s3cli.presign(path);

			const data = { id, avatar: url, ...fields };
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
