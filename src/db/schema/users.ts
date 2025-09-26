import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

//TODO: ver uma forma de um usuário conseguir atribuir um apelido a outro

export const users = pgTable("users", {
  id: text().primaryKey().notNull(),
  authId: text(),
  avatar: text(),
  name: varchar().notNull().unique(),
  email: text().unique().notNull(),
  password: text(),
  createdAt: timestamp().defaultNow().notNull(),
  deletedAt: timestamp(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
