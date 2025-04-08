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
import { listChatsByUserRoute } from "./routes/chats/list-chats-by-user-route";
import fastifyMultipart from "@fastify/multipart";
import { uploadFileRoute } from "./routes/images/upload-images";

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
app.register(fastifyMultipart, {
	limits: { fileSize: 10 * 1024 * 1024 }, //10 MB
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(createUserRoute);
app.register(sendCodeToUserRoute);
app.register(createChatRoute);
app.register(listChatsByUserRoute);
app.register(uploadFileRoute);

app
	.listen({ port: env.PORT })
	.then(() => {
		console.log(chalk.blueBright("HTTP/Websocket Server running!"));
	})
	.catch((e) => {
		console.log(e);
	});
