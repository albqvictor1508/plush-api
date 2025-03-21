import { pgTable, serial } from "drizzle-orm/pg-core";

export const chats = pgTable("chats", {
	id: serial("id").notNull().primaryKey(),
});
