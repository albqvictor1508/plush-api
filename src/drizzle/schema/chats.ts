import { pgTable, serial, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const chats = pgTable("chats", {
	id: serial("id").notNull().primaryKey(),
	title: text("title"),
	createdBy: uuid("created_by")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	lastMessageAt: timestamp("last_message_at").defaultNow(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
