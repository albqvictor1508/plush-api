import type { WebSocket } from "ws";

export type SendMessageParams = {
	content: string;
	userId: string;
	socket: WebSocket;
};
