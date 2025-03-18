import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "../common/env";

export const pg = postgres(env.DATABASE_URL);
export const db = drizzle(pg, { schema: { users } });
