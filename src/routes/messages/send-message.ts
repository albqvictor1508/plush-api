import type { FastifyPluginAsync } from "fastify";
import type WebSocket from "ws";

const clients = new Set<WebSocket>();

export const sendMessageRoute: FastifyPluginAsync = async (app) => {
	app.get("/api/ws", { websocket: true }, async (socket, req) => {
		socket.on("message", (data) => {
			clients.add(socket);
			for (const client of clients) {
				if (client !== socket && client.readyState === client.OPEN) {
					client.send(data);
				}
			}
		});
	});
};
