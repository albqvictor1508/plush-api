import fastifyCookie from "@fastify/cookie";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { env } from "src/common/env";
import { ErrorMessages } from "src/common/error/messages";

export async function createApp() {
	const app = fastify();

	app.withTypeProvider<ZodTypeProvider>();
	app.setValidatorCompiler(validatorCompiler);
	app.setSerializerCompiler(serializerCompiler);

	await app.register(fastifyJwt, {
		secret: env.JWT_SECRET,
	});

	await app.register(fastifyCookie, {
		secret: env.JWT_SECRET,
		parseOptions: {
			httpOnly: true,
			sameSite: "strict",
			secure: env.NODE_ENV === "prod",
		},
	});

	//TODO: criar as sessions,
	//adicionar healthcheck do redis na rota health

	await app.register(fastifySwagger, {
		openapi: {
			info: {
				title: `${env.APP_NAME} API`,
				description: `${env.APP_NAME} API documentation`,
				version: "1.0.0",
			},
		},
	});

	await app.register(fastifySwaggerUi, {
		routePrefix: "/docs",
	});

	const ALLOWED_HEADERS: string[] = [
		"authorization",
		"user-agent",
		"content-type",
	];

	app.addHook("onRequest", async (request, reply) => {
		for await (const header of Object.keys(request.headers)) {
			if (!ALLOWED_HEADERS.includes(header.toLowerCase()))
				return `header ${header} is not allowed`;
		}
	});

	app.addHook("onRequest", async (request, reply) => {
		const NON_AUTH_ROUTES: string[] = [];

		const { jwt } = app;
		const { plush } = request.cookies;
		const { url } = request;

		if (url === "/health" || url.startsWith("/docs")) return;
		if (NON_AUTH_ROUTES.includes(url)) return;

		const user = jwt.verify(plush as string);
		if (!user) return reply.code(401).send({ error: ErrorMessages[2001] }); //WARN: tratar erro

		app.decorateRequest("auth", { user });
	});

	return app;
}
