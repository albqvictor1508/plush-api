import { app } from "../../server";
import { WebSocketServer } from "ws";
import { websocketAuth } from "./websocket-auth";
import { handleMessage } from "./handlers/message";

export const wss = new WebSocketServer({
	server: app.server,
	verifyClient: (info, done) => {
		websocketAuth(app, info)
			.then((user) => {
				if (user) {
					done(true);
					return;
				}
				done(false);
			})
			.catch(() => done(false));
	},
});

wss.on("connection", (ws, req) => {
	const user = app.parseCookie(req.headers.cookie as string);
	if (!user) {
		ws.close(1008, "invalid user data");
		return;
	}

	ws.user = user;
	ws.on("message", async (data) => {
		try {
			await handleMessage(ws, data);
		} catch (e) {
			app.log.error(`Message handling error: ${e}`);
			ws.send(JSON.stringify({ error: `error on send message: ${e}` }));
		}
	});

	ws.on("close", () => {
		app.log.info(`Client disconnected: ${ws.user?.email}`);
	});
});
