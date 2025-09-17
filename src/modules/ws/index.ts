import c from "chalk";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

interface DataSchema {
  type: EventType
}

export const route: FastifyPluginAsyncZod = async (app) => {
  app.get("/ws", { websocket: true }, async (ws, req) => {
    ws.on("message", (msg) => {
      const data = JSON.parse(msg);
      switch (data.type)
      ws.send("hello from fastify ws!");
    });
  });
};
