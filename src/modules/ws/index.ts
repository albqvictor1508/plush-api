import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import type { IncomingEventMap, WSIncomingEvent } from "src/@types/ws";
import { addConnection, handlers } from "src/common/ws";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/ws/:userId",
    {
      schema: {
        summary: "Websocket route.",
        tags: ["socket"],
        params: z.object({
          userId: z.string(),
        }),
      },
      websocket: true,
    },
    async (ws, request) => {
      const { userId } = request.params;

      addConnection(userId, ws);

      ws.send("hello");

      ws.on("message", async (msg) => {
        //@ts-expect-error
        const data: WSIncomingEvent = JSON.parse(msg);
        const handler = handlers[data.type];

        //@ts-expect-error
        await handler(data.body);

        ws.send(JSON.stringify(data.body));
      });

      ws.on("close", async (code) => {
        console.log(`conexão fechou: ${code}`);
      });
    },
  );
};
