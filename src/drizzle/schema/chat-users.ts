import { pgTable, serial, uuid } from "drizzle-orm/pg-core";
import { chats } from "./chats";
import { users } from "./users";

export const chatUsers = pgTable("chat_users", {
	chatId: serial("chat_id")
		.notNull()
		.references(() => chats.id)
		.primaryKey(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id)
		.primaryKey(),
});
