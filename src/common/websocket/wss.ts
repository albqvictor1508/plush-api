import { WebSocketServer } from "ws";
import { env } from "../env";

const wss = new WebSocketServer({ port: env.PORT });

wss.on("connection", (ws) => {
	ws.on("message", (data) => {
		console.log(data);
	});
});
