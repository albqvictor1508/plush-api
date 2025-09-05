import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

const sql = postgres()
export const db = drizzle({
  client: sql,
  casing: "snake_case"
})
