import type { FastifyInstance } from "fastify";
import type { IncomingMessage } from "node:http";
import type { JWTDecoded } from "../../types/auth";
import { parseCookie } from "../../utils/parse-cookie";

export async function websocketAuth(
	app: FastifyInstance,
	info: { req: IncomingMessage },
): Promise<JWTDecoded | null> {
	try {
		const cookieHeader = info.req.headers.cookie || "";
		const user = await parseCookie(cookieHeader);

		return user;
	} catch (e) {
		app.log.error(`Failed to authenticate on Websocket: ${e}`);
		return null;
	}
}
