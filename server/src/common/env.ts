import { cleanEnv, num, str, url } from "envalid";

export const env = cleanEnv(process.env, {
	// Configuração do Banco e Autenticação
	DATABASE_URL: url(),
	JWT_SECRET: str(),
	PORT: num(),
	COOKIE_SECRET: str(),

	// Configuração de E-mail
	MY_GMAIL: str(),
	MY_GMAIL_PASSWORD: str(),

	// Configuração do Cloudflare R2
	R2_ENDPOINT: str(),
	R2_ACCESS_KEY: str(),
	R2_SECRET_KEY: str(),
	R2_BUCKET_NAME: str(),
});
