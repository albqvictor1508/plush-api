export enum EventType {
  MESSAGE_CREATED = "message_created",
  MESSAGE_UPDATED = "message_updated",
  MESSAGE_DELETED = "message_deleted",
  JOIN_CHAT = "chat_join",
  OUT_CHAT = "chat_out",
  UPDATE_CHAT = "chat_update",
}

export interface IncomingEventMap {
  [EventType.JOIN_CHAT]: { chatId: string; userId: string };
  [EventType.OUT_CHAT]: { chatId: string; userId: string };
  [EventType.MESSAGE_CREATED]: {
    chatId: string;
    senderId: string;
    content: string;
  };
}

export interface OutgoingEventMap {
  [EventType.MESSAGE_CREATED]: {
    chatId: string;
    senderId: string;
    content: string;
    ts: number;
  };
  [EventType.MESSAGE_UPDATED]: {
    chatId: string;
    messageId: string;
    content: string;
  };
  [EventType.MESSAGE_DELETED]: { chatId: string; messageId: string };
  [EventType.UPDATE_CHAT]: {
    chatId: string;
    name?: string;
    lastMessage?: string;
  };
}

export type WSIncomingEvent = {
  [K in keyof IncomingEventMap]: { type: K; body: IncomingEventMap[K] };
}[keyof IncomingEventMap];

export type WSOutgoingEvent = {
  [K in keyof OutgoingEventMap]: { type: K; body: OutgoingEventMap[K] };
}[keyof OutgoingEventMap];
