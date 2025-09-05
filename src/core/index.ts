import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { fastify } from "fastify"
import { type ZodTypeProvider, validatorCompiler, serializerCompiler } from "fastify-type-provider-zod"
import { env } from "src/common/env";

export async function createApp() {
  const app = fastify()

  app.withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  app.register(fastifyJwt, {
    secret: env.JWT_SECRET
  })

  app.register(fastifyCookie, {
    secret: env.JWT_SECRET,
    parseOptions: {
      httpOnly: true,
      sameSite: "strict",
      secure: env.NODE_ENV === "prod"
    }
  })

  const ALLOWED_HEADERS: string[] = ["authorization", "user-agent", "content-type"];
  const NON_AUTH_ROUTES: string[] = ["/health"]

  app.addHook("onRequest", async (request, reply) => {
    for await (const header of Object.keys(request.headers)) {
      if (!ALLOWED_HEADERS.includes(header.toLowerCase())) return `header ${header} is not allowed`
    }
  })

  app.addHook("onRequest", async (request, reply) => {
    let auth = { id: "", email: "" }
    const { url } = request;

    if (NON_AUTH_ROUTES.includes(url)) return auth

  })
  //TODO: 'middleware' de auth pra validar jwt e cookie e retornar o user

  return app;
}

