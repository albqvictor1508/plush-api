import { WebSocketServer } from "ws";
import { env } from "../env";

const wss = new WebSocketServer({ port: env.WEBSOCKET_PORT });

wss.on("connection", (ws, req) => {
	console.log("User connected! ");

	ws.on("message", (data) => {
		//verifica se o cliente que ta mandando não sou eu e verifica se o cliente está conectado no websocket
		for (const client of wss.clients) {
			if (client !== ws && client.readyState === client.OPEN) {
				client.send(data);
			}
		}
	});
});
//fazer uma rota HTTP que aciona esse websocket que retorne {"userId": "1", message: "bom dia"}
