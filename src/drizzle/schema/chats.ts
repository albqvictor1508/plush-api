import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";

export const chats = pgTable("chats",{
  id: uuid("id").primaryKey().defaultRandom(),
  id_user1: uuid("id_user1").notNull().references(()=>users.id),
  id_user2: uuid("id_user2").notNull().references(()=>users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  status: boolean("status").notNull().default(false)
})
