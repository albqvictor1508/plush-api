import type { WebSocket } from "ws";

export type SendMessageParams = {
	content: string;
	userId: string;
	socket: WebSocket;
};

export type CreateChatParams = {
	userId: string;
	title: string;
};
