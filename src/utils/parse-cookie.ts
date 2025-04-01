import { app } from "../server";
import type { JWTDecoded } from "../types/auth";

export async function parseCookie(cookieHeader: string) {
	const cookies = app.parseCookie(cookieHeader); //parseia os cookies de string pra objeto
	if (!cookies?.plush_auth) {
		throw new Error("Missing auth cookie");
	}
	const token = decodeURIComponent(cookies.plush_auth); //tira os caracteres especiais
	console.log(`TOKEN: ${token}`);

	const decoded = app.jwt.verify<JWTDecoded>(token); //verifica o jwt

	if (!decoded?.id || !decoded?.email) {
		throw new Error("Invalid JWT payload!");
	}

	return { id: decoded.id, email: decoded.email };
}
