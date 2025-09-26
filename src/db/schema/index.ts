import { chatParticipants } from "./chat-participants.ts";
import { chats } from "./chats.ts";
import { files } from "./files.ts";
import { messages } from "./messages.ts";
import { sessions } from "./sessions.ts";
import { users } from "./users.ts";

export const schema = {
  users,
  sessions,
  chats,
  messages,
  chatParticipants,
  files,
};
