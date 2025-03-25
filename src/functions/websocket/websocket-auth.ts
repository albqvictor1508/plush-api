import type { FastifyInstance } from "fastify";
import type { IncomingMessage } from "node:http";
import type { JWTDecoded } from "../../types/auth";

export async function websocketAuth(
	app: FastifyInstance,
	info: { req: IncomingMessage },
): Promise<JWTDecoded | null> {
	try {
		const cookieHeader = info.req.headers.cookie || ""; //pega o cookie se tiver o cookie
		const cookies = app.parseCookie(cookieHeader); //parseia o cookie pra um objeto

		if (!cookies?.plush_auth) {
			throw new Error("Missing auth cookie");
		}

		const token = decodeURIComponent(cookies.plush_auth); //tira os caracter especial do token

		const decoded = app.jwt.verify<JWTDecoded>(token); //verifica se o cookie é válido

		if (!decoded?.id || !decoded?.email) {
			throw new Error("Invalid JWT payload!");
		}

		return { id: decoded.id, email: decoded.email };
	} catch (e) {
		app.log.error(`Failed to authenticate on Websocket: ${e}`);
		return null;
	}
}
