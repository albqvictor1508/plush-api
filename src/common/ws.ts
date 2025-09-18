import {
  EventType,
  type IncomingEventMap,
  type OutgoingEventMap,
} from "src/@types/ws";

type WsHandler = {
  //@ts-expect-error
  [K in EventType]: (body: IncomingEventMap[K] & OutgoingEventMap[K]) => void;
};

export const handlers: WsHandler = {
  [EventType.JOIN_CHAT]: (body) => { },
  [EventType.UPDATE_CHAT]: (body) => { },
  [EventType.OUT_CHAT]: (body) => { },
  [EventType.MESSAGE_CREATED]: (body) => { },
  [EventType.MESSAGE_DELETED]: (body) => { },
  [EventType.MESSAGE_UPDATED]: (body) => { },
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
