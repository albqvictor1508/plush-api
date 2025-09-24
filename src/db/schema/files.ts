import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

import { messages } from "./messages";
export const photos = pgTable("files", {
  id: text().primaryKey().notNull(),
  messageId: text()
    .notNull()
    .references(() => messages.id),
  extension: text({
    enum: ["pdf", "docx", "jpg", "png", "webp", "jpeg"],
  }).notNull(), //futuramente pode ser um enum
  sendedAt: timestamp().defaultNow(),
});
