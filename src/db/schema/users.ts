import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

//TODO: ver uma forma de um usuário conseguir atribuir um apelido a outro

export const users = pgTable("users", {
  id: text().primaryKey(),
  authId: text("auth_id"),
  avatar: text("avatar"),
  name: varchar("name", { length: 15 }).notNull().unique(),
  email: text("email").unique().notNull(),
  password: text("password"),
  deletedAt: timestamp("deleted_at"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});
