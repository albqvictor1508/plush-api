import type { WebSocket } from "ws";

export type SendMessageParams = {
	content: string;
	userId: string;
	socket: WebSocket;
};

export type CreateChatParams = {
	title: string;
	type?: Type.PRIVATE | Type.GROUP;
	userId: string;
	participantsIds: string[];
	minimumParticipants?: 1 | 2;
};

export enum Type {
	PRIVATE = "private",
	GROUP = "group",
}
