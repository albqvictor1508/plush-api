import type { WebSocket } from "ws";

export type SendMessageParams = {
	content: string;
	userId: string;
	socket: WebSocket;
};

export type CreateChatParams = {
<<<<<<< Updated upstream
	title: string;
	ownerId: string;
=======
	ownerId: string;
	title: string;
>>>>>>> Stashed changes
	participantId: string;
};

export enum Type {
	PRIVATE = "private",
	GROUP = "group",
}
