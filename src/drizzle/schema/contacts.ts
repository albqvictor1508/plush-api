import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull().unique(),
	email: text(),
});
