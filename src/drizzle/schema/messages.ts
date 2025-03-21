<<<<<<< HEAD
import {
	pgTable,
	serial,
	text,
	uuid,
	timestamp,
	integer,
} from "drizzle-orm/pg-core";
import { chats } from "./chats";
=======
import { pgTable, serial, text, uuid, timestamp } from "drizzle-orm/pg-core";
>>>>>>> f14857a (chore: changes on schema to make the chats)
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
<<<<<<< HEAD
	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at"),
	deletedAt: timestamp("deleted_at"),
=======
	sentAt: timestamp("sent_at").notNull().defaultNow(),
>>>>>>> f14857a (chore: changes on schema to make the chats)
});
