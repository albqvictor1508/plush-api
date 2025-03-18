import fastify from "fastify";
import { fastifyCors } from "@fastify/cors";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import {
	type ZodTypeProvider,
	validatorCompiler,
	serializerCompiler,
} from "fastify-type-provider-zod";
import { home } from "./routes/home";
import { env } from "./common/env";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors);
app.register(jwt, {
	secret: env.JWT_SECRET,
});
app.register(cookie);

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);
//validador e serializador do zod, pro fastify conseguir ler e enviar os dados usando o zod
app.register(home); //rota de home ("/")
//escolhe a porta que vai ser aberta pra API e abre essa porta (e o console.log pra avisar que subiu)
app.listen({ port: 3333 }, () => {
	console.log("HTTP Server running!");
});
