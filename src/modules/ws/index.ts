import c from "chalk";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const route: FastifyPluginAsyncZod = async (app) => {
	app.get("/ws", { websocket: true }, async (ws, req) => {
		ws.on("message", (msg) => {
			console.log(c.green(`CLIENT: ${msg}`));
			ws.send("hello from fastify ws!");
		});
	});
};
