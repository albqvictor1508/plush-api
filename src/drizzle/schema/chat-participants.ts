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

<<<<<<< Updated upstream
=======
const roleEnum = pgEnum("role", ["member", "admin"]);

>>>>>>> Stashed changes
export const chatParticipants = pgTable(
	"chat_participants",
	{
		chatId: serial("chat_id")
			.notNull()
			.references(() => chats.id, { onDelete: "cascade" }),
		userId: uuid("user_id")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
<<<<<<< Updated upstream
		role: text("role"),
		joinedAt: timestamp("joined_at").defaultNow().notNull(),
=======
		joined_at: timestamp().defaultNow(),
>>>>>>> Stashed changes
	},
	(table) => ({
		pk: primaryKey({ columns: [table.chatId, table.userId] }),
	}),
);
