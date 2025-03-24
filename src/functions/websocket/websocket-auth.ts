import type { FastifyInstance } from "fastify";
import type { IncomingMessage } from "node:http";

export async function websocketAuth(
	app: FastifyInstance,
	info: { req: IncomingMessage },
	done: (result: boolean) => void,
) {
	try {
		const cookieHeader = info.req.headers.cookie || ""; //pega o cookie se tiver o cookie
		const cookies = app.parseCookie(cookieHeader); //parseia o cookie pra um objeto

		if (!cookies?.plush_auth) {
			throw new Error("Missing auth cookie");
		}

		await app.jwt.verify(cookies.plush_auth); //verifica se o cookie é válido
		done(true);
	} catch (e) {
		app.log.error(`Failed to authenticate on Websocket: ${e}`);
		done(false);
	}
}
