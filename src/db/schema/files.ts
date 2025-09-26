import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { chats } from "./chats";
import { messages } from "./messages";
import { users } from "./users";

//arquivo pode ser attach, profile, o krl, tenho que ver essa questão
export const files = pgTable("files", {
  id: text().primaryKey().notNull(),
  chatId: text().references(() => chats.id),
  messageId: text().references(() => messages.id),
  userId: text().references(() => users.id),
  extension: text({
    enum: ["pdf", "docx", "jpg", "png", "webp", "jpeg"],
  }).notNull(), //futuramente pode ser um enum

  sendedAt: timestamp().defaultNow(),
});
