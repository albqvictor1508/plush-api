import { pgTable, text, timestamp, serial } from "drizzle-orm/pg-core";
import { chats } from "./chats";
import { users } from "./users";

export const chatParticipants = pgTable("chat_participants", {
	chatId: serial("chat_id")
		.primaryKey()
		.notNull()
		.references(() => chats.id),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	role: text({ enum: ["member", "admin"] }).notNull(),
	addedAt: timestamp("added_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at")
		.notNull()
		.defaultNow()
		.$onUpdate(() => new Date()),
});
