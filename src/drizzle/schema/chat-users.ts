import { pgTable, primaryKey, serial, uuid } from "drizzle-orm/pg-core";
import { chats } from "./chats";
import { users } from "./users";

export const chatUsers = pgTable(
	"chat_users",
	{
		chatId: serial("chat_id")
			.notNull()
			.references(() => chats.id),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.chatId, table.userId] }),
	}),
);
