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
import { authHook, headersHook } from "src/common/hooks";

export const TWO_MIN_IN_SECS = "120";
export const isProd = env.NODE_ENV === "prod";

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
      secure: isProd,
    },
  });

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

  await app.register(authHook);
  await app.register(headersHook);

  return app;
}
