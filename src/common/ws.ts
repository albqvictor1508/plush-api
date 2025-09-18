import {
  EventType,
  type IncomingEventMap,
  type OutgoingEventMap,
} from "src/@types/ws";

type WsHandler = {
  //@ts-expect-error
  [K in EventType]: (body: IncomingEventMap[K]) => Promise<void>;
};

export const handlers: WsHandler = {
  [EventType.JOIN_CHAT]: async (body) => {
    const { chatId, userId } = body;
    console.log(`CHAT ID: ${chatId}, USER ID: ${userId}`);
  },
  [EventType.UPDATE_CHAT]: async (body) => { },
  [EventType.OUT_CHAT]: async (body) => { },
  [EventType.MESSAGE_CREATED]: async (body) => { },
  [EventType.MESSAGE_DELETED]: async (body) => { },
  [EventType.MESSAGE_UPDATED]: async (body) => { },
} as const;

export const sendEvent = async <T extends keyof OutgoingEventMap>(
  ws: WebSocket,
  type: T,
  body: OutgoingEventMap[T],
) => {
  ws.send(JSON.stringify({ type, body }));
};

export const onEvent = async <T extends keyof IncomingEventMap>(
  ws: WebSocket,
  type: T,
  handler: (body: IncomingEventMap[T]) => void,
) => { };
