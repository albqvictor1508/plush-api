import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { users } from "./users";

export const chats = pgTable("chats", {
  id: text().primaryKey().notNull(),
  ownerId: text("owner_id").references(() => users.id),
  title: varchar({ length: 50 }).notNull(),
  avatar: text().notNull(),
  description: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
