import type { FastifyPluginAsync } from "fastify";
import { isProd } from "src/core";
import { ErrorMessages } from "./error/messages";

export const authHook: FastifyPluginAsync = async (app) => {
	app.addHook("preHandler", async (request, reply) => {
		if (!isProd) return; //ve se faz sentido isso
		const NON_AUTH_ROUTES: string[] = [];

		const { jwt } = app;
		const { access } = request.cookies;
		const { url } = request;

		if (url === "/health" || url.startsWith("/docs")) return;
		if (NON_AUTH_ROUTES.includes(url)) return;

		try {
			const user = jwt.verify(access as string);
			if (!user) return reply.code(401).send({ error: ErrorMessages[2001] }); //WARN: tratar erro
			(request as any).auth = user;
		} catch (error) {
			console.log(error);
			throw error; //WARN: tratar erro
		}
	});
};

export const headersHook: FastifyPluginAsync = async (app) => {
	app.addHook("onRequest", async (request, _) => {
		const ALLOWED_HEADERS = ["authorization", "user-agent", "content-type"];

		for await (const header of Object.keys(request.headers)) {
			if (!ALLOWED_HEADERS.includes(header.toLowerCase()))
				return `header ${header} is not allowed`;
		}
	});
};
