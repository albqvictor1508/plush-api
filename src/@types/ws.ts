export enum EventType {
  MESSAGE_CREATED = "message_created",
  MESSAGE_UPDATED = "message_updated",
  MESSAGE_DELETED = "message_deleted",

  CHAT_CREATED = "chat_created",
  JOIN_CHAT = "chat_join",
  OUT_CHAT = "chat_out",
  CHAT_UPDATED = "chat_updated",
}

export interface IncomingEventMap {
  [EventType.CHAT_CREATED]: {
    title: string;
    description: string;
    ownerId: string;
    avatar: string;
    participants: Set<string>;
  };
  [EventType.JOIN_CHAT]: { chatId: string; participants: Set<string> };
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
  [EventType.MESSAGE_DELETED]: { chatId: number; messageId: string };
}

export type WSIncomingEvent = {
  [K in keyof IncomingEventMap]: { type: K; body: IncomingEventMap[K] };
}[keyof IncomingEventMap];

export type WSOutgoingEvent = {
  [K in keyof OutgoingEventMap]: { type: K; body: OutgoingEventMap[K] };
}[keyof OutgoingEventMap];

//input
export type WsHandler = {
  //@ts-expect-error
  [K in EventType]: (body: IncomingEventMap[K]) => Promise<void>;
};

//output
export type WsEmitter = {
  //@ts-expect-error
  [K in EventType]: (body: OutgoingEventMap[K]) => Promise<void>;
};
