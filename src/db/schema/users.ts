import { bigint, pgTable, text, timestamp } from "drizzle-orm/pg-core";

//TODO: ver uma forma de um usuário conseguir atribuir um apelido a outro

export const users = pgTable("users", {
  id: bigint("id", { mode: "bigint" }).primaryKey(),
  email: text().unique().notNull(),
  authId: text(),
  avatar: text(),
  password: text(),
  deletedAt: timestamp(),
  updatedAt: timestamp().notNull().defaultNow()
})
