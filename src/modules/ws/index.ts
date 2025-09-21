import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import type { WSIncomingEvent } from "src/@types/ws";
import { handlers } from "src/common/ws";
import type { WebSocket } from "ws";

const connections = new Set<WebSocket>(); //cada chat vai ter uma pool de conexão dessas, por isso vou usar um agrupamento do redis

export const route: FastifyPluginAsyncZod = async (app) => {
	app.get("/ws", { websocket: true }, async (ws, req) => {
		connections.add(ws);

		ws.on("message", async (msg) => {
			//@ts-expect-error
			const data: WSIncomingEvent = JSON.parse(msg);
			const handler = handlers[data.type];

			//@ts-expect-error
			await handler(data.body);

			ws.send(JSON.stringify(data.body));

			//isso aq é o broadcast, vai enviar a mensagem pra todas as outras
			//conexões, menos para você mesmo
			for (const conn of connections) {
				if (conn !== ws)
					ws.send(JSON.stringify({ type: "message_created", body: data }));
			}
		});

		ws.on("close", async (code) => {
			connections.delete(ws);
			console.log(`conexão fechou: ${code}`);
		});
	});
};
