import chalk from "chalk";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { verifyAgent } from "src/common/agent";
import { env } from "src/common/env";
import { Snowflake } from "src/common/snowflake";
import { generateAccessToken, generateRefreshToken } from "src/config/auth";
import { db } from "src/db/client";
import { sessions } from "src/db/schema/sessions";
import { users } from "src/db/schema/users";
import z from "zod";

interface UserOptions {
  sub: string;
  email: string;
  picture: string;
  nickname: string;
}

export const route: FastifyPluginAsyncZod = async (app) => {
  const {
    APP_NAME,
    AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET,
    AUTH0_CALLBACK_URL,
    AUTH0_DOMAIN,
  } = env;
  app.get(
    "/sessions/google/cb",
    {
      schema: {
        summary: "Oauth google callback route.",
        tags: ["sessions"],
        querystring: z.object({
          code: z.string(),
          state: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const agent = verifyAgent(request.headers["user-agent"]);

      //@ts-expect-error
      const auth0Cookie = JSON.parse(request.headers[`${APP_NAME}_auth0`]);
      const { code, state } = request.query;

      if (auth0Cookie.state !== state) {
        console.log(chalk.red(`COOKIE STATE: ${auth0Cookie.state}`));
        console.log(chalk.red(` STATE: ${state}`));
        throw new Error("errro"); //WARN: tratar erro
      }

      const tokenBody = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: AUTH0_CLIENT_ID,
        client_secret: AUTH0_CLIENT_SECRET,
        code,
        redirect_uri: AUTH0_CALLBACK_URL,
        code_verifier: auth0Cookie.codeVerifier,
      });
      let tokenReply: Response;
      try {
        tokenReply = await fetch(`https://${AUTH0_DOMAIN}/oauth/token`, {
          method: "POST",
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
          body: tokenBody,
        });
      } catch (error) {
        console.log(error);
        throw error;
      }

      //@ts-expect-error
      const { access_token: accessToken } = await tokenReply.json();
      let userReply: Response;
      try {
        userReply = await fetch(`https://${AUTH0_DOMAIN}/userinfo`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: tokenBody,
        });
      } catch (error) {
        console.log(error);
        throw error;
      }

      if (!userReply.ok) return reply.code(401); //WARN: tratar erro

      const {
        sub: authId,
        email,
        picture: avatar,
        nickname: name,
      } = (await userReply.json()) as UserOptions;

      const isNameUsed = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.name, name));
      if (isNameUsed) return reply.code(401); //WARN: tratar erro

      const isEmailUsed = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email));
      if (isEmailUsed) return reply.code(401); //WARN: tratar erro

      const id = (await new Snowflake().create()).toString();
      const [user] = await db
        .insert(users)
        .values({
          id,
          authId,
          updatedAt: new Date(),
          name,
          avatar,
          email,
        })
        .returning({ id: users.id, email: users.email });
      if (!user) throw new Error("erro"); //WARN: tratar erro

      const access = await generateAccessToken(user);
      const { hash, token } = generateRefreshToken();

      const FIFTEEN_DAYS_LATER = new Date(
        Date.now() + 15 * 24 * 60 * 60 * 1000,
      );

      await db.insert(sessions).values({
        userId: user.id,
        browser: agent.family,
        hash,
        os: agent.os.family,
        ip: request.ip,
        expiresAt: FIFTEEN_DAYS_LATER,
      });

      const FIFTEEN_MIN_IN_MS = 900000;
      const FIFTEEN_DAYS_IN_MS = 1.296e9;

      reply.setCookie("access", access, { maxAge: FIFTEEN_MIN_IN_MS });
      reply.setCookie("refresh", token, { maxAge: FIFTEEN_DAYS_IN_MS });
    },
  );
};
