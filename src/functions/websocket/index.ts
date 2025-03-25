import { app } from "../../server";
import { websocketAuth } from "./websocket-auth";
import { handleMessage } from "./handlers/message";
import { WebSocketServer } from "ws";

export const wss = new WebSocketServer({
	server: app.server,
	// verifyClient: (info, done) => {
	// 	websocketAuth(app, info, done)
	// 		.then((user) => {
	// 			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	// 			// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
	// 			user ? ((info.req as any).user = user && done(true)) : done(false);
	// 		})
	// 		.catch(() => done(false));
	// },
});

wss.on("connection", (ws, req) => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	// const user = (req as any).user;
	// if (!user) {
	// 	throw new Error("invalid user data");
	// }

	// ws.user = user;
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
