import { cleanEnv, str, url } from "envalid";

export const env = cleanEnv(process.env, {
	DATABASE_URL: url(),
	POSTGRES_USER: str(),
	POSTGRES_PASSWORD: str(),
	POSTGRES_DB: str(),
});
