import {
	pgTable,
	serial,
	text,
	uuid,
	timestamp,
	pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { chats } from "./chats";

<<<<<<< Updated upstream
// const messageStatusEnum = pgEnum("message_status", [
// 	"sent",
// 	"delivered",
// 	"read",
// 	"deleted",
// ]);
=======
const statusEnum = pgEnum("status", ["sent", "delivered"]);
>>>>>>> Stashed changes

export const messages = pgTable("messages", {
	id: serial("id").primaryKey().notNull(),
	userId: uuid("user_id")
		.notNull()
<<<<<<< Updated upstream
		.references(() => users.id, { onDelete: "set null" }),
=======
		.references(() => users.id, { onDelete: "cascade" }),
>>>>>>> Stashed changes
	chatId: serial("chat_id")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
<<<<<<< Updated upstream
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at"),
	deletedAt: timestamp("deleted_at"),
=======
	status: statusEnum(),
	sentAt: timestamp("sent_at").notNull().defaultNow(),
>>>>>>> Stashed changes
});
