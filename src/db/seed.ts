import { reset } from "drizzle-seed";
import { db, sql } from "./client";
import { schema } from "./schema";

await reset(db, { schema });

//seed no banco (dps eu faço)

await sql.end();
