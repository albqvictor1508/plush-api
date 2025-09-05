import { reset } from "drizzle-seed";
import { schema } from "./schema";
import { db, sql } from "./client";

await reset(db, { schema });

await sql.end();
