import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const sendMessage: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/api/messages",
		{
			schema: {
				body: z.object({
					author: z.object({ phone: z.string() }), //pego os dados do user pelo phone pra saber quem tá mandando a mensagem
					message: z.string(),
					to: z.object({ phone: z.string() }), //pego os dados de outro user pra saber pra quem a mensagem tá sendo enviada
				}),
			},
		},
		(request, reply) => {
			app.server.on("open-connection", () => {
				//abre a conexão com o websocket
			});

			app.server.on("send-message", () => {
				//envia mensagem
			});
			app.server.on("receive-message", () => {
				//recebe mensagem
			});

			app.server.on("close-connection", () => {
				//fecha a conexão com o websocket
			});
		},
	);
};
