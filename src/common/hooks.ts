import type { FastifyPluginAsync } from "fastify";

export const authHook: FastifyPluginAsync = async (app) => {
	app.addHook("preHandler", async (request, _) => {
		const { url: path } = request;
		const { jwt } = app;
		const NON_AUTH_ROUTES = [
			"/health",
			"/sessions",
			"/sessions/signup",
			"/sessions/@me",
			"/sessions/:id",
			"/ws",
		];

		if (NON_AUTH_ROUTES.includes(path) || path.startsWith("/docs")) return;
		try {
			const { access } = request.cookies;
			//@ts-expect-error
			const user: { id: string; email: string } = jwt.verify(access);
			if (!user) throw new Error("Bad Credentials"); //WARN: tratar erro

			(request as any).user = user;
		} catch (err) {
			console.log(err);
			throw err;
		}
	});
};

export const headersHook: FastifyPluginAsync = async (app) => {
	app.addHook("preHandler", async (request, reply) => {
		const PERMITTED_HEADERS = ["user-agent", "authorization", "content-type"];
		const { headers } = request;
		for (const header of Object.keys(headers)) {
			if (!PERMITTED_HEADERS.includes(header.toLowerCase()))
				throw new Error("tratar erro"); //WARN: tratar erro
		}
	});
};
