import { app } from "../../server";
import type WebSocket from "ws";
import { WebSocketServer } from "ws";
import { websocketAuth } from "./websocket-auth";
import { handleMessage } from "./handlers/message";
import type { IncomingMessage } from "node:http";
import { parseCookie } from "../../utils/parse-cookie";

export const wss = new WebSocketServer({
	server: app.server,
});

wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
	const user = await parseCookie(req.headers.cookie || "");
	if (!user) {
		ws.close(1008, "invalid user data");
		return;
	}
	ws.user = user;

	ws.on("message", async (data) => {
		try {
			await handleMessage(ws, data);
		} catch (e) {
			ws.send(
				JSON.stringify({
					error: `error on send message: ${e}`,
				}),
			);
		}
	});

	ws.on("close", () => {
		app.log.info(`Client disconnected: ${ws.user?.email}`);
	});
});
