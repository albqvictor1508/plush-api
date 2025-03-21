<<<<<<< HEAD
export type CreateChatParams = {
	title: string;
	ownerId: string;
	participantId: string;
};

export enum Type {
	PRIVATE = "private",
	GROUP = "group",
}
=======
import type { WebSocket } from "ws";

export type SendMessageParams = {
	content: string;
	userId: string;
	socket: WebSocket;
};
>>>>>>> f14857a (chore: changes on schema to make the chats)
