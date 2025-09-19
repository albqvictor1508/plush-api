import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import type { WSIncomingEvent } from "src/@types/ws";
import { handlers } from "src/common/ws";

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
