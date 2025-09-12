import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const route: FastifyPluginAsyncZod = async (app) => {
  app.get("/sessions/oauth/google", {}, async (request, reply) => { });
};
