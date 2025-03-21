import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import type WebSocket from "ws";

const clients = new Set<WebSocket>(); //criar um conjunto pra guardar as conexões

export const sendMessageRoute: FastifyPluginAsyncZod = async (app) => {
	app.get("/api/messages/send", { websocket: true }, (socket, req) => {
		clients.add(socket);
		socket.on("message", (data) => {
			for (const client of clients) {
				//ver se não sou eu e pegar todos que estão com a comunicação aberta (conectados)
				if (client !== socket && client.readyState === client.OPEN) {
					client.send(data);
				}
			}
		});
	});
};
