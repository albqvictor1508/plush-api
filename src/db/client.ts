import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "src/common/env";
import { schema } from "./schema/index.ts";

const DATABASE_URL =
	env.NODE_ENV === "prod" ? env.DATABASE_URL : env.DATABASE_PUBLIC_URL;

export const sql = postgres(DATABASE_URL);

export const db = drizzle(sql, {
	schema,
	casing: "snake_case",
});
