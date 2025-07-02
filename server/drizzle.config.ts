import type { Config } from "drizzle-kit";
import { env } from "./src/common/env";

export default {
	schema: "./src/drizzle/schema/*", //pasta que vai ter os schemas do banco (esse * lê todos os arquivos dentro dessa pasta)
	out: "./src/drizzle/migrations", //pasta onde vai ser colocado os sql das migration
	dialect: "postgresql", //dialeto do banco, porque de banco pra banco, muda a forma como o SQL é inscrito
	dbCredentials: {
		url: env.DATABASE_URL, //url do banco
	},
} satisfies Config;
