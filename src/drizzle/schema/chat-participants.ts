import {
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { chats } from "./chats";
import { users } from "./users";

const roleEnum = pgEnum("user_role", ["admin", "member"]);

export const chatParticipants = pgTable(
	"chat_participants",
	{
		chatId: integer("chat_id")
			.notNull()
			.references(() => chats.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: roleEnum("user_role").notNull().default("member"),
		joined_at: timestamp().notNull().defaultNow(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.chatId, table.userId] }),
	}),
);
