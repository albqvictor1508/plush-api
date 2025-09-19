import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const chats = pgTable("chats", {
  id: text().primaryKey().notNull(),
  title: varchar({ length: 50 }).notNull(),
  avatar: text().notNull(),
  description: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
  deletedAt: timestamp(),
});
