import { app } from "../../server";
import { WebSocketServer } from "ws";
import { handleMessage } from "./handlers/message";
import type { IncomingMessage } from "node:http";
import { parseCookie } from "../../utils/parse-cookie";
import { JWTDecoded } from "../../types/auth";

export const wss = new WebSocketServer({
  server: app.server,
});

//TODO: REFATORAR ISSO TUDO AQUI PQ ESSA LIB TA ESTRANHA

wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
  const user: JWTDecoded = await parseCookie(req.headers.cookie || "");
  if (!user) {
    ws.close(1008, "invalid user data");
    return;
  }

  ws.on("message", async (data) => {
    try {
      await handleMessage(ws, user, data);
    } catch (e) {
      ws.send(
        JSON.stringify({
          error: `error on send message: ${e}`,
        }),
      );
    }
  });

  ws.on("close", () => {
    app.log.info(`Client disconnected: ${ws.user?.email}`);
  });
});
