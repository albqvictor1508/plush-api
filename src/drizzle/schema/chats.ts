<<<<<<< HEAD
import { pgTable, serial, text, uuid, timestamp } from "drizzle-orm/pg-core";
=======
import {
	pgTable,
	serial,
	text,
	boolean,
	uuid,
	timestamp,
} from "drizzle-orm/pg-core";
>>>>>>> f14857a (chore: changes on schema to make the chats)
import { users } from "./users";

export const chats = pgTable("chats", {
	id: serial("id").notNull().primaryKey(),
	title: text("title"),
<<<<<<< HEAD
	createdBy: uuid("created_by")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
=======
	isGroup: boolean("is_group").default(false).notNull(),
	createdAt: uuid("created_by").references(() => users.id),
	lastMessageAt: timestamp("last_message_at"),
>>>>>>> f14857a (chore: changes on schema to make the chats)
});
