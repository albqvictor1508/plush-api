import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../common/env";
import postgres from "postgres";
import { users } from "./schema/users";

export const pg = postgres(env.DATABASE_URL);
export const db = drizzle(pg, { schema: { users } });
