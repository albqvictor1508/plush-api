import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(), //incremental porque n vai expor na URL
	//status
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	description: text("description"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	lastActiveAt: timestamp("last_active_at").notNull(),
});
