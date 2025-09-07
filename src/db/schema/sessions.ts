import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    hash: text().notNull().unique(),
    expiresAt: timestamp("expires_at"),
    os: text().notNull(),
    ip: text(),
    browser: text().notNull(),
  },
  (table) => [
    index("user_id_idx").on(table.userId),
    index("expires_at_idx").on(table.expiresAt),
  ],
);
