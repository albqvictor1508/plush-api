import { cleanEnv, url } from "envalid";

export const env = cleanEnv(process.env, {
	DATABASE_URL: url(),
});
