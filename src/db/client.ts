import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { env } from "src/common/env"

export const sql = postgres(env.DATABASE_URL)

export const db = drizzle(sql, {
  casing: "snake_case"
})
