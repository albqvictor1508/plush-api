import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { hashRefreshToken } from "src/common/auth";
import { db } from "src/db/client";
import { sessions } from "src/db/schema/sessions";

export const route: FastifyPluginAsyncZod = async (app) => {
  app.delete("/sessions/@me", async (request, reply) => {
    const { refresh } = request.cookies;
    if (!refresh) return reply.code(400).send("Bad Credentials"); //WARN: TRATAR

    await db
      .delete(sessions)
      .where(eq(sessions.hash, hashRefreshToken(refresh)));
  });
};
