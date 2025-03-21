import { pgTable, serial, text, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";

export const messages = pgTable("messages", {
	id: serial("id").primaryKey().notNull(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id),
	content: text("content").notNull(),
	sentAt: timestamp("sent_at").notNull().defaultNow(),
});
