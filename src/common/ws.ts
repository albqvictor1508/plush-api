import {
  EventType,
  //type OutgoingEventMap,
  type WsHandler,
} from "src/@types/ws";

export const CONSUMER_NAME = `consumer-${process.pid}`;
export const STREAM_KEY = "lume:stream";
export const GROUP_NAME = "lume:group";

export const handlers: WsHandler = {
  [EventType.CHAT_CREATED]: async (body) => {
    const { title, avatar, description } = body;
    console.log(`TITLE: ${title}`);
    console.log(`AVATAR: ${avatar}`);
    console.log(`description: ${description}`);
  },

  [EventType.JOIN_CHAT]: async (body) => { },
  [EventType.CHAT_UPDATED]: async (body) => { },
  [EventType.OUT_CHAT]: async (body) => {
    const { chatId, userId } = body;
    console.log(`chatid: ${chatId}, userId: ${userId}`);
  },
  [EventType.MESSAGE_CREATED]: async (body) => { },
  [EventType.MESSAGE_DELETED]: async (body) => { },
  [EventType.MESSAGE_UPDATED]: async (body) => { },
} as const;
