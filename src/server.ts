import fastify from "fastify";
import jwt from "@fastify/jwt";
import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import {
	type ZodTypeProvider,
	validatorCompiler,
	serializerCompiler,
} from "fastify-type-provider-zod";
import { env } from "./common/env";
import { createUserRoute } from "./routes/auth/new-user-route";
import { sendCodeToUserRoute } from "./routes/auth/send-code-route";
import { createChatRoute } from "./routes/chats/create-chat-route";
import chalk from "chalk";

export const app = fastify().withTypeProvider<ZodTypeProvider>();
app.register(fastifyCors, { credentials: true });
app.register(jwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: "plush_auth",
		signed: false,
	},
});
app.register(fastifyCookie, { secret: env.COOKIE_SECRET });

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(createUserRoute);
app.register(sendCodeToUserRoute);
app.register(createChatRoute);

app
	.listen({ port: env.PORT })
	.then(() => {
		console.log(chalk.greenBright("HTTP/Websocket Server running!"));
	})
	.catch((e) => {
		console.log(e);
	});
