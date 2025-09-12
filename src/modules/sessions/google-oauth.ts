import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { setupBetterAuth } from "src/config/auth";

const betterauth = await setupBetterAuth();

export const route: FastifyPluginAsyncZod = async (app) => {
  app.post("/sessions/oauth/google", {}, async (request, reply) => {
    const { }
    const session = await betterauth.api.getSession(request, reply);
  });
};
