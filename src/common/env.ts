import { cleanEnv, num, str, url } from "envalid";

export const env = cleanEnv(process.env, {
	DATABASE_URL: url(),
	JWT_SECRET: str(),
	COOKIE_SECRET: str(),
	PORT: num(),
	MY_GMAIL: str(),
<<<<<<< HEAD
	MY_GMAIL_PASSWORD: str(),
=======
	MY_GMAIL_PASSWORD: str()
>>>>>>> b06f45bdb7638535c2f16d8ecc3c1a59c68b7986
});
