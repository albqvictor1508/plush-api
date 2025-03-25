import fastify from "fastify";
import jwt from "@fastify/jwt";
import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import {
	type ZodTypeProvider,
	validatorCompiler,
	serializerCompiler,
} from "fastify-type-provider-zod";
import { env } from "./common/env";
import { createUserRoute } from "./routes/auth/new";
import { sendCodeToUserRoute } from "./routes/auth/send";

const app = fastify().withTypeProvider<ZodTypeProvider>();

//registrar Plugins
app.register(fastifyCors);
app.register(jwt, { secret: env.JWT_SECRET });
app.register(fastifyCookie);
app.register(fastifyMultipart, {
	limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB por arquivo
});

//configurar Validação e Serialização com Zod
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

//validador e serializador do zod, pro fastify conseguir ler e enviar 
app.register(createUserRoute);
app.register(sendCodeToUserRoute);

//escolhe a porta que vai ser aberta pra API e abre essa porta (e o console.log pra avisar que subiu)
app
	.listen({ port: env.PORT })
	.then(() => {
		console.log(`🚀 HTTP Server running on port ${env.PORT}`);
	})
	.catch((e) => {
		console.error("❌ Erro ao iniciar o servidor:", e);
	});
