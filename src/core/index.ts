import { fastify } from "fastify"
import { type ZodTypeProvider, validatorCompiler, serializerCompiler } from "fastify-type-provider-zod"

async function createApp() {
  const app = fastify()

  app.withTypeProvider<ZodTypeProvider>();
  app.setValidatorCompiler(validatorCompiler)
  app.setSerializerCompiler(serializerCompiler)

}

