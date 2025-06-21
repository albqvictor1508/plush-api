import {
	boolean,
	pgTable,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const contacts = pgTable("contacts", {
	id: serial("id").primaryKey().notNull(),
	userId: uuid("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	photoUrl: text("photo_url"),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	isFixed: boolean("is_fixed").$default(() => false),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at"),
});
