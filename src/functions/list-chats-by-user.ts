import { and, desc, eq, max} from "drizzle-orm";
import { db } from "../drizzle/client";
import { chats, messages } from "../drizzle/schema";

export async function listChatsByUser(userId: string) {
  // pegar o maior id entre as mensagens (que seria a mais recente, pq o id é incremental)
  //agrupo por chat id, ai pego o maior id daquele grupo
  //tenho que validar isso também
  const [lastMessageId] = await db.select({chatId: messages.chatId,messageId: max(messages.id)}).from(messages).groupBy(messages.chatId);
  console.log(`THE BIGGER MESSAGE ID IS ${lastMessageId.messageId}, CONTENT: por enquanto vazio`);
  //pegar a mensagem

  //essa msr ta retornando todas as mensagens do chat que foi enviada a mensagem com maior id
	const listedChats = await db
		.select({title: chats.title, chatId: chats.id, lastMessageAt: chats.lastMessageAt, lastMessage: messages.content})
		.from(chats)
    .innerJoin(messages, and(eq(chats.id, lastMessageId.chatId), eq(messages.id, lastMessageId.messageId as number))) //erro ta aqui
		.orderBy(desc(chats.lastMessageAt));

	return { chat: {listedChat: listedChats.map(chat => {chat})} };

  //return {chat: listedChats}
}
