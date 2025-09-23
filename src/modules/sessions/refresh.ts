import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { refresh } from "src/functions/auth/refresh";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/sessions/refresh",
    {
      schema: {
        summary: "Refresh user token route.",
        tags: ["sessions"],
        response: {
          200: z.object({ id: z.string(), email: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { access, refreshed, user } = await refresh(
        request.cookies.refresh,
      );

      const FIFTEEN_MIN_IN_MS = 900000;
      const FIFTEEN_DAYS_IN_MS = 1.296e9;

      reply.setCookie("access", access, { maxAge: FIFTEEN_MIN_IN_MS });
      reply.setCookie("refresh", refreshed, { maxAge: FIFTEEN_DAYS_IN_MS });

      return reply.status(200).send(user);
    },
  );
};
