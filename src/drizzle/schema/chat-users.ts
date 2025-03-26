import {
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { chats } from "./chats";
import { users } from "./users";

const roleEnum = pgEnum("user_role", ["member", "admin"]);

export const chatUsers = pgTable(
	"chat_users",
	{
		chatId: serial("chat_id")
			.notNull()
			.references(() => chats.id),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id),
		role: roleEnum(),
		joined_at: timestamp().defaultNow(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.chatId, table.userId] }),
	}),
);
