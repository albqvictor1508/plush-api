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
import { uploadFileRoute } from "./routes/storage/uploadImages";

const app = fastify().withTypeProvider<ZodTypeProvider>();

// registrar plugins (registrar antes das rotas)
app.register(fastifyCors);
app.register(jwt, { secret: env.JWT_SECRET });
app.register(fastifyCookie);
app.register(fastifyMultipart, {
	limits: { fileSize: 10 * 1024 * 1024 }, // limite de 10MB por arquivo
});

// configurar validação e serialização com Zod
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// registrar Rotas
app.register(createUserRoute);
app.register(sendCodeToUserRoute);
app.register(uploadFileRoute);

// iniciar servidor
app
	.listen({ port: env.PORT })
	.then(() => {
		console.log(`🚀 HTTP Server running on port ${env.PORT}`);
	})
	.catch((e) => {
		console.error("Erro ao iniciar o servidor:", e);
	});
