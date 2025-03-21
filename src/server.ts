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
import { createUserRoute } from "./routes/auth/new";
import { sendCodeToUserRoute } from "./routes/auth/send";

const app = fastify().withTypeProvider<ZodTypeProvider>();
app.register(fastifyCors);
app.register(jwt, {
	secret: env.JWT_SECRET,
});
app.register(fastifyCookie);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
//validador e serializador do zod, pro fastify conseguir ler e enviar os dados usando o zod
app.register(createUserRoute);
app.register(sendCodeToUserRoute);
//escolhe a porta que vai ser aberta pra API e abre essa porta (e o console.log pra avisar que subiu)
app
	.listen({ port: env.PORT })
	.then(() => {
		console.log("HTTP Server running!");
	})
	.catch((e) => {
		console.log(e);
	});
