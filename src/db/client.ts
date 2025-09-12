import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "src/common/env";
import { isProd } from "src/core/index.ts";
import { schema } from "./schema/index.ts";
const DATABASE_URL = isProd ? env.DATABASE_URL : env.DATABASE_PUBLIC_URL;

export const sql = postgres(DATABASE_URL);

export const db = drizzle(sql, {
  schema,
  casing: "snake_case",
  logger: true, //posso criar um logger manualmente: https://orm.drizzle.team/docs/goodies#logging
});
