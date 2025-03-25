import {
	pgTable,
	serial,
	text,
	boolean,
	uuid,
	timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const chats = pgTable("chats", {
	id: serial("id").notNull().primaryKey(),
	title: text("title"),
	isGroup: boolean("is_group").default(false).notNull(),
	createdAt: uuid("created_by").references(() => users.id),
	lastMessageAt: timestamp("last_message_at"),
});
