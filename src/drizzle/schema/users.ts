import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(), //incremental porque n vai expor na URL
	name: text("name").notNull(),
	phone: text("phone").notNull().unique(),
	description: text("description"),
	// status: depois eu faço, mei complicado
	createdAt: timestamp("created_at").notNull().defaultNow(),
});
