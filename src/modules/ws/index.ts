import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { randomUUID } from "node:crypto";
import type { WSIncomingEvent } from "src/@types/ws";
import { redis } from "src/common/cache";
import { handlers } from "src/common/ws";

const streamKey = "stream:chats";
const groupName = "lume_api_group";
const consumerName = `consumer-${randomUUID()}`;

export const listenToChatStream = async () => {
	try {
		const res = await redis.send("XGROUP", [
			"CREATE",
			streamKey,
			groupName,
			"0",
			"MKSTREAM",
		]);
	} catch (err: any) {
		if (err.message.includes("BUSYGROUP")) {
			console.log("the chat already exist");
		}
	}

	while (true) {
		try {
			const res = await redis.send("XREADGROUP", [
				"GROUP",
				groupName,
				consumerName,
				"COUNT",
				"1",
				"BLOCK",
				"0",
				"STREAMS",
				streamKey,
				">",
			]);

			if (res && res.length > 0) {
				const [stream] = res;
				const [message] = res;
				const messageId = res;
				const data = message[1];

				const typeIndex = "salve";
			}
		} catch (error) {
			console.log(error);
			throw error;
		}
	}
};

export const route: FastifyPluginAsyncZod = async (app) => {
	app.get("/ws", { websocket: true }, async (ws, req) => {
		ws.on("message", async (msg) => {
			//@ts-expect-error
			const data: WSIncomingEvent = JSON.parse(msg);
			const handler = handlers[data.type];

			//@ts-expect-error
			await handler(data.body);

			ws.send(JSON.stringify(data.body));
		});

		ws.on("close", async (code) => {
			console.log(`conexão fechou: ${code}`);
		});
	});
};
