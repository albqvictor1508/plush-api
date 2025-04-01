import {
	pgTable,
	serial,
	text,
	uuid,
	timestamp,
	pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";

const typeEnum = pgEnum("type", ["private", "group"]);

export const chats = pgTable("chats", {
	id: serial("id").notNull().primaryKey(),
	title: text("title"),
<<<<<<< Updated upstream
	type: text("type"),
	createdBy: uuid("created_by")
		.notNull()
		.references(() => users.id, {
			onDelete: "cascade",
		}),
	lastMessageAt: timestamp("last_message_at").defaultNow().notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
=======
	createdBy: uuid("created_by").references(() => users.id, {
		onDelete: "cascade",
	}),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	lastMessageAt: timestamp("last_message_at"),
>>>>>>> Stashed changes
});
