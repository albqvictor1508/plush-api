export enum EventType {
	MESSAGE_CREATED = "message:created",
	MESSAGE_UPDATED = "message:updated",
	MESSAGE_DELETED = "message:deleted",

	JOIN_CHAT = "chat:join",
	OUT_CHAT = "chat:out",
	UPDATE_CHAT = "chat:update",
}

export interface DataSchema {
	type: EventType;
	body: {}; //esse body tem que mudar para cada evento
}
