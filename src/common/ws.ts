import {
	EventType,
	//type OutgoingEventMap,
	type WsHandler,
} from "src/@types/ws";
import { WebSocket } from "ws";

export const CONSUMER_NAME = `consumer-${process.pid}`;
export const STREAM_KEY = "lume:stream";
export const GROUP_NAME = "lume:group";

const connections = new Map<string, WebSocket>();

export const addConnection = (userId: string, ws: WebSocket) => {
	if (connections.has(userId)) {
		connections.get(userId)?.close(1000, "New connection established");
	}

	connections.set(userId, ws);
	console.log(
		`[WS] User ${userId} connected. Total connections: ${connections.size}`,
	);
};

export const removeConnection = (userId: string) => {
	if (connections.has(userId)) {
		connections.delete(userId);
		console.log(
			`[WS] User ${userId} disconnected. Total connections: ${connections.size}`,
		);
	}
};

export const broadcast = (userIds: string[], payload: object) => {
	const stringifiedPayload = JSON.stringify(payload);
	let sentCount = 0;

	for (const userId of userIds) {
		const ws = connections.get(userId);

		if (ws && ws.readyState === WebSocket.OPEN) {
			ws.send(stringifiedPayload);
			sentCount++;
		}
	}

	if (userIds.length > 0) {
		console.log(
			`[WS] Broadcast sent to ${sentCount}/${userIds.length} targeted users.`,
		);
	}
};

export const handlers: WsHandler = {
	[EventType.CHAT_CREATED]: async (body) => {
		const { title, avatar, description } = body;
		console.log(`TITLE: ${title}`);
		console.log(`AVATAR: ${avatar}`);
		console.log(`description: ${description}`);
	},

	[EventType.JOIN_CHAT]: async (body) => {},
	[EventType.CHAT_UPDATED]: async (body) => {},
	[EventType.OUT_CHAT]: async (body) => {
		const { chatId, userId } = body;
		console.log(`chatid: ${chatId}, userId: ${userId}`);
		console.log("vai toma no cu");
	},
	[EventType.MESSAGE_CREATED]: async (body) => {},
	[EventType.MESSAGE_DELETED]: async (body) => {},
	[EventType.MESSAGE_UPDATED]: async (body) => {},
} as const;
