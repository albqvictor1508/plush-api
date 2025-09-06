import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

//TODO: ver uma forma de um usuário conseguir atribuir um apelido a outro

export const users = pgTable("users", {
  id: text().primaryKey(),
  username: text(),
  authId: text(),
  avatar: text(),
  password: text(),
  deletedAt: timestamp(),
  updatedAt: timestamp().notNull().defaultNow()
})
