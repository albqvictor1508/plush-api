import { WebSocketServer } from "ws";
import { app } from "../../server";
import { websocketAuth } from "./websocket-auth";
import { handleMessage } from "./handlers/message";

export const wss = new WebSocketServer({
	server: app.server,
	verifyClient: async (info, done) => {
		websocketAuth(app, info, done).catch(() => done(false));
	},
});

wss.on("connection", (ws, req) => {
	ws.on("message", async (data) => {
		try {
			await handleMessage(ws, data);
		} catch (e) {
			app.log.error(`Message handling error: ${e}`);
			ws.send(JSON.stringify({ error: `error on send message: ${e}` }));
		}
	});
});
