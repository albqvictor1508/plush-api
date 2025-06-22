import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { codes } from "../../functions/user/send-code-to-user.ts";
import { createUser } from "../../functions/user/create-user";

export const createUserRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/auth/user",
    {
      schema: {
        body: z.object({
          email: z.string().email(),
          code: z.string().length(4),
        }),
        response: {
          400: z.object({
            error: z.string(),
          }),
          201: z.object({
            id: z.string().uuid(),
            email: z.string().email(),
            name: z.string(),
            description: z.string().nullable(),
            createdAt: z.date(),
            lastActiveAt: z.date().nullable(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, code } = request.body;

      const storedCode = codes[email];
      if (!storedCode || storedCode.code !== code) {
        return reply.status(400).send({ error: "invalid or expired code" });
      }

      const user = await createUser({ email });
      const token = app.jwt.sign({
        name: user.name,
        email: user.email,
      });
      return reply.setCookie("jwt", token).status(201).send(user);
    },
  );
};
