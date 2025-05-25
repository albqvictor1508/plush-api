export type CreateChatParams = {
	title: string;
	ownerId: string;
	participantsId: string[];
};

export type MessageSchema = {
	id: number;
	userId: string | null;
	chatId: number;
	status: "sent" | "delivered" | "viewed";
	content: string;
	createdAt: Date;
	updatedAt: Date | null;
	deletedAt: Date | null;
};

export enum Type {
	PRIVATE = "private",
	GROUP = "group",
}
import type { WebSocket } from "ws";

export type SendMessageParams = {
	content: string;
	userId: string;
	socket: WebSocket;
};
