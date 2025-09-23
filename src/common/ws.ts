import {
  EventType,
  //type OutgoingEventMap,
  type WsHandler,
} from "src/@types/ws";
import { db } from "src/db/client";
import { chatParticipants } from "src/db/schema/chat-participants";
import { chats } from "src/db/schema/chats";
import { users } from "src/db/schema/users";
import { createChat } from "src/functions/chats/create";
import type { WebSocket } from "ws";

export const connections = new Map<string, WebSocket[]>();

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
    console.log("vai toma no cu");
  },
  [EventType.MESSAGE_CREATED]: async (body) => { },
  [EventType.MESSAGE_DELETED]: async (body) => { },
  [EventType.MESSAGE_UPDATED]: async (body) => { },
} as const;

export const broadcast = async (
  ws: WebSocket,
  chatId: string,
  data: unknown,
) => {
  const connection = connections.get(chatId);
  if (!connection) throw new Error(); //WARN: tratar erro

  for (const conn of connection) {
    if (conn !== ws) {
      ws.send(JSON.stringify(data));
    }
  }
};
