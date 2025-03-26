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

const participantRoleEnum = pgEnum("user_role", ["member", "admin"]);

export const chatParticipants = pgTable(
	"chat_participants",
	{
		chatId: serial("chat_id")
			.notNull()
			.references(() => chats.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		role: participantRoleEnum("role").notNull().default("member"),
		joinedAt: timestamp("joined_at").defaultNow().notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.chatId, table.userId] }),
	}),
);
