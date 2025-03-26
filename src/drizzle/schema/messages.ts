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

const messageStatusEnum = pgEnum("message_status", [
	"sent",
	"delivered",
	"read",
	"deleted",
]);

export const messages = pgTable("messages", {
	id: serial("id").primaryKey().notNull(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	chatId: serial("chat_id")
		.notNull()
		.references(() => chats.id),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at"),
	deletedAt: timestamp("deleted_at"),
	status: messageStatusEnum("status").default("sent"),
});
