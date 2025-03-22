import type { FastifyPluginAsync } from "fastify";
import WebSocket from "ws";

// tenho que pegar os dados do usuário via cookie, se não tiver cookie, pelo JWT, se n tiver nenhum dos dois, lança erro
// tenho que salvar o chat e a mensagem na suas devidas tabelas
// tenho que trazer o id do usuário, o id da mensagem, o id da conversa, conteúdo da conversa, hora q foi enviada

const clients = new Set<WebSocket>();

export const createWebsocketRoute: FastifyPluginAsync = async (app) => {
	app.get("/api/ws", { websocket: true }, async (socket, request) => {
		try {
			socket.on("message", (message) => {
				clients.add(socket);
				for (const client of clients) {
					if (client !== socket && client.readyState === WebSocket.OPEN) {
						client.send(
							JSON.stringify({ userId: 1, message: message.toString("utf8") }),
						);
					}
				}
			});
		} catch (e) {
			return e;
		}
	});
};
