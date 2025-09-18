enum EventType {
	MESSAGE_CREATED = "message_created",
	MESSAGE_UPDATED = "message_updated",
	MESSAGE_DELETED = "message_deleted",

	JOIN_CHAT = "chat_join",
	OUT_CHAT = "chat_out",
	UPDATE_CHAT = "chat_update",
}

interface EventBody<T extends EventType> {
	[EventType.JOIN_CHAT]: { userId: string; chatId: string };
	[EventType.OUT_CHAT]: { userId: string; chatId: string };
	[EventType.UPDATE_CHAT]: { userId: string; chatId: string; role: string };
}

interface WebsocketBody extends DataSchema<EventType, {}> {}
