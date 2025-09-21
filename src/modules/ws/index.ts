import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import type { WSIncomingEvent } from "src/@types/ws";
import { handlers } from "src/common/ws";
import { db } from "src/db/client";
import { chats } from "src/db/schema/chats";
import type { WebSocket } from "ws";
import z from "zod";

export const chatConnections = new Map<string, WebSocket[]>(); //cada chat vai ter uma pool de conexão dessas, por isso vou usar um agrupamento do redis

export const route: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/ws/:chatId",
		{
			websocket: true,
			schema: {
				params: z.object({
					chatId: z.string().default(""),
				}),
			},
		},
		async (ws, req) => {
			const { chatId } = req.params;

			const [chat] = await db
				.select({ id: chats.id })
				.from(chats)
				.where(eq(chats.id, chatId));
			if (!chat) throw new Error("error"); //WARN: dps eu vejo oq eu faço com isso

			chatConnections.set(chat.id, [ws]);
			//preciso de alguma forma receber o chatId aqui.

			ws.on("message", async (msg) => {
				//@ts-expect-error
				const data: WSIncomingEvent = JSON.parse(msg);
				const handler = handlers[data.type];

				//@ts-expect-error
				await handler(data.body);

				ws.send(JSON.stringify(data.body));

				//isso aq é o broadcast, enviando a mensagem para todos os clientes
				//conectados, menos ele mesmo
				for (const conn of chatConnections.get(chat.id)!) {
					if (conn !== ws)
						ws.send(JSON.stringify({ type: "message_created", body: data }));
				}
			});

			ws.on("close", async (code) => {
				chatConnections.delete(chat.id);
				console.log(`conexão fechou: ${code}`);
			});
		},
	);
};
