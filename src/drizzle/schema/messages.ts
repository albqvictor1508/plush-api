import {
	pgTable,
	serial,
	text,
	uuid,
	timestamp,
	integer,
} from "drizzle-orm/pg-core";
import { chats } from "./chats";
import { users } from "./users";

export const messages = pgTable("messages", {
	id: serial("id").primaryKey().notNull(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "set null" }),
	chatId: integer("chat_id")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at"),
	deletedAt: timestamp("deleted_at"),
});
