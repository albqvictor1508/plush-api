import {
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { chats } from "./chats";
import { users } from "./users";

export const chatParticipants = pgTable(
	"chat_participants",
	{
		chatId: serial("chat_id")
			.notNull()
			.references(() => chats.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: text("role"),
		joinedAt: timestamp("joined_at").defaultNow().notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.chatId, table.userId] }),
	}),
);
