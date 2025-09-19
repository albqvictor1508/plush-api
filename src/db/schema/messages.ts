import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { chats } from "./chats";
import { users } from "./users";

export const messages = pgTable("messages", {
	id: text().notNull().primaryKey(),
	chatId: text("chat_id")
		.notNull()
		.references(() => chats.id),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	photo: text(),
	content: varchar({ length: 255 }).notNull(),
	sendedAt: timestamp("sended_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.$onUpdate(() => new Date()),
});
