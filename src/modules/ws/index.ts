import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { EventType } from "src/@types/ws";

interface DataSchema {
	type: EventType;
	body: {}; //esse body tem que mudar para cada evento
}

export const route: FastifyPluginAsyncZod = async (app) => {
	app.get("/ws", { websocket: true }, async (ws, req) => {
		ws.on("message", (msg) => {
			//@ts-expect-error
			const data: DataSchema = JSON.parse(msg);

			ws.send("hello from fastify ws!");
			switch (data.type) {
				case EventType.MESSAGE_CREATED: {
					return;
				}

				case EventType.MESSAGE_DELETED: {
				}
			}
		});
	});
};
