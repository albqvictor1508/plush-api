import type WebSocket from "ws";

export async function handleMessage(ws: WebSocket, data: Buffer) {
	if (!ws.user) throw new Error("salve");
}
