import { drizzle } from "drizzle-orm/neon-http";
import { env } from "../common/env";
import { neon } from "@neondatabase/serverless";

export const sql = neon(env.DATABASE_URL);
export const db = drizzle({ client: sql });
