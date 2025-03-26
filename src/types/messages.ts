import type { WebSocket } from "ws";

export type SendMessageParams = {
	content: string;
	userId: string;
	socket: WebSocket;
};

export type CreateChatParams = {
	title: string;
	type: Type.PRIVATE | Type.GROUP;
	userId: string;
	participants: string[]; //id's dos participantes do gp, pelos id nois pega as info deles
};

enum Type {
	PRIVATE = "private",
	GROUP = "group",
}

enum Role {
	MEMBER = "member",
	ADMIN = "admin",
}
