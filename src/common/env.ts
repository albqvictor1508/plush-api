import { cleanEnv, num, str, url } from "envalid";

export const env = cleanEnv(process.env, {
	DATABASE_URL: url(),
	JWT_SECRET: str(),
	COOKIE_SECRET: str(),
	PORT: num(),
	MY_GMAIL: str(),
	MY_GMAIL_PASSWORD: str(),
});
