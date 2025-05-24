import {
	pgTable,
	serial,
	text,
	uuid,
	timestamp,
	integer,
	pgEnum,
} from "drizzle-orm/pg-core";
import { users, chats } from "./index";

const statusEnum = pgEnum("message_status", ["sent", "delivered", "viewed"]);

export const messages = pgTable("messages", {
	id: serial("id").primaryKey().notNull(),
	userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
	chatId: integer("chat_id")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	status: statusEnum("message_status").notNull().default("sent"),
	content: text("content").notNull(),
	fileUrl: text("file_url"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at"),
	deletedAt: timestamp("deleted_at"),
});
