import {
	pgTable,
	serial,
	text,
	uuid,
	timestamp,
	pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./index";

const chatTypeEnum = pgEnum("chat_type", ["private", "group"]);

export const chats = pgTable("chats", {
	id: serial("id").notNull().primaryKey(),
	title: text("title"),
	chatType: chatTypeEnum("chat_type").notNull().default("private"),
	createdBy: uuid("created_by")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	lastMessageAt: timestamp("last_message_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
