import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { env } from "src/common/env";
import { getAuthorizationData } from "src/config/auth";

export const route: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/sessions/oauth/google",
    {
      schema: {
        summary: "Oauth google route.",
        tags: ["sessions"],
      },
    },
    async (request, reply) => {
      const { redirectTo, codeChallenge, codeVerifier } =
        await getAuthorizationData();

      await reply.setCookie(
        `${env.APP_NAME}_auth0`,
        JSON.stringify({ redirectTo, codeChallenge, codeVerifier }),
      );

      reply.redirect(redirectTo.toString());
    },
  );
};
