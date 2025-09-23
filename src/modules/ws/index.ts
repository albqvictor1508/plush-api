import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import type { WSIncomingEvent } from "src/@types/ws";
import { handlers } from "src/common/ws";
import { db } from "src/db/client";
import { chats } from "src/db/schema/chats";
import type { WebSocket } from "ws";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/ws",
		{
			websocket: true,
		},
		async (ws, _) => {
			ws.on("message", async (msg) => {
				//@ts-expect-error
				const data: WSIncomingEvent = JSON.parse(msg);
				const handler = handlers[data.type];

				//@ts-expect-error
				await handler(data.body);

				ws.send(JSON.stringify(data.body));

				//isso aq é o broadcast, enviando a mensagem para todos os clientes
				//conectados, menos ele mesmo
			});

			ws.on("close", async (code) => {
				console.log(`conexão fechou: ${code}`);
			});
		},
	);
};
