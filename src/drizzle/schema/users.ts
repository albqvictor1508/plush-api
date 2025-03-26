import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

const userStatusEnum = pgEnum("status", ["online", "offline"]);

export const users = pgTable("users", {
	id: uuid("id").primaryKey().defaultRandom(), //incremental porque n vai expor na URL
	status: userStatusEnum("status").default("offline"),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	description: text("description"),
	createdAt: timestamp("created_at").notNull().defaultNow(),
	lastActiveAt: timestamp("last_active_at").notNull(),
});
