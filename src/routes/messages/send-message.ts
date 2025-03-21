import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { sendMessage } from "../../functions/send-message";

//vou criar uma rota pra re

export const sendMessageRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/api/messages/send",
		{
			websocket: true,
		},
		(socket, request) => {
			socket.on("connection", () => {
				console.log("teste");
				socket.on("message", async () => {
					const clients = new Set<typeof socket>(); //criar um conjunto pra guardar as conexões

					const [message] = await db
						.insert(messages)
						.values({ userId, content })
						.returning();

					for (const client of clients) {
						if (client !== socket && client.readyState === client.OPEN) {
							client.send(message.content);
						}
					}
					return { message };
				});
			});
		},
	);
};
