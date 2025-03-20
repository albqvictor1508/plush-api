import { cleanEnv, num, str, url } from "envalid";

export const env = cleanEnv(process.env, {
	DATABASE_URL: url(),
	JWT_SECRET: str(),
	MY_PHONE: str(),
	VONAGE_API_KEY: str(),
	VONAGE_API_SECRET: str(),
	PORT: num(),
});
