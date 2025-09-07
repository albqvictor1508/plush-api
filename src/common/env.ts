import * as e from "envalid";

export const env = e.cleanEnv(process.env, {
	JWT_SECRET: e.str(),
	NODE_ENV: e.str({ default: "dev" }),

	DATABASE_URL: e.url(),
	DATABASE_PUBLIC_URL: e.url(),

	REDIS_HOST: e.str(),
	REDIS_PORT: e.port(),
	PORT: e.port(),
	APP_NAME: e.str(),

	BUCKET_ACCESS_KEY_ID: e.str(),
	BUCKET_SECRET_ACCESS_KEY: e.str(),
});
