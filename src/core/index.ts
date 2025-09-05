import { fastify } from "fastify"
import { type ZodTypeProvider, validatorCompiler, serializerCompiler } from "fastify-type-provider-zod"

export async function createApp() {
  const app = fastify()

  app.withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

  const ALLOWED_HEADERS: string[] = ["authorization", "user-agent", "content-type"];
  const NON_AUTH_ROUTES: string[] = ["/health"]

  app.addHook("onRequest", async (request, reply) => {
    for await (const header of Object.keys(request.headers)) {
      if (!ALLOWED_HEADERS.includes(header.toLowerCase())) return `header ${header} is not allowed`
    }
  })

  app.addHook("onRequest", async (request, reply) => {
    const { url } = request;
    console.log(url)
    //if (NON_AUTH_ROUTES.includes(url))
  })
  //TODO: 'middleware' de auth pra validar jwt e cookie e retornar o user

  return app;
}

