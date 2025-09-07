import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { refresh } from "src/functions/auth/refresh";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
  app.post("/refresh", {}, async (request, reply) => {
    const access = request.cookies["access"] ?? null;
    const salve = await refresh(access);
  });
};
