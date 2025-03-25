import type { FastifyInstance } from "fastify";
import type { IncomingMessage } from "node:http";
import type { JWTDecoded } from "../../types/auth";

export async function websocketAuth(
	app: FastifyInstance,
	info: { req: IncomingMessage },
	done: (result: boolean) => void,
): Promise<JWTDecoded | null> {
	try {
		const cookieHeader = info.req.headers.cookie || ""; //pega o cookie se tiver o cookie
		const cookies = app.parseCookie(cookieHeader); //parseia o cookie pra um objeto

		if (!cookies?.plush_auth) {
			throw new Error("Missing auth cookie");
		}

		const decoded = await app.jwt.verify<JWTDecoded>(cookies.plush_auth); //verifica se o cookie é válido

		if (!decoded) {
			throw new Error("Invalid JWT!");
		}

		done(true);
		return { id: decoded.id, email: decoded.email };
	} catch (e) {
		app.log.error(`Failed to authenticate on Websocket: ${e}`);
		done(false);
		return null;
	}
}
