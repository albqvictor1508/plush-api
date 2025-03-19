import { cleanEnv, str, url } from "envalid";

export const env = cleanEnv(process.env, {
	DATABASE_URL: url(),
	JWT_SECRET: str(),
	MY_PHONE: str(),
	AWS_SECRET_ACCESS_KEY: str(),
	AWS_ACCESS_KEY_ID: str(),
});
