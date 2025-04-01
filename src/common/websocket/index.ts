import { app } from "../../server";
import type WebSocket from "ws";
import { WebSocketServer } from "ws";
import { websocketAuth } from "../../functions/websocket/websocket-auth";
import { handleMessage } from "../../functions/websocket/handlers/message";
import { parseCookie } from "../../utils/parse-cookie";

export const wss = new WebSocketServer({
	server: app.server,
	verifyClient: (info, done) => {
		websocketAuth(app, info)
			.then((user) => {
				if (user) {
					done(true);
				} else {
					done(false);
				}
			})
			.catch(() => done(false));
	},
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
