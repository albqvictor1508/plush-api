import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { env } from "src/common/env";
import { Snowflake } from "src/common/snowflake";
import { db } from "src/db/client";
import { users } from "src/db/schema/users";
import z from "zod";

const { APP_NAME } = env

export const route: FastifyPluginAsyncZod = async (app) => {
  app.post("/sessions", {
    schema: {
      body: z.object({
        email: z.email({ error: "Invalid email." }),
        avatar: z.optional(z.string()),
        password: z.string({ error: "Invalid password." })
          .min(6, { error: "the password must to be greater than 6 characters" })
          .refine((payload: string) => {

            if (!(payload.includes(""))) return false // fazer um array de caracteres especiais, se tiver pelo menos 1 desses ta liberado
          }), //usar o refine() pra validar senha com caracter especial e td email
      }),
      response: {
        201: z.void()
      }
    }
  }, async (request, reply) => {
    const { jwt } = app
    const { email, password, avatar } = request.body
    //salvar avatar no bucket
    //validar sessão do usuário

    const isEmailUsed = await db.select({ email: users.email }).from(users).where(eq(users.email, email));
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!isEmailUsed) return reply.send();

    const id = await new Snowflake().create();
    const user = await db.insert(users).values({
      id,
      email,
      avatar: "", //url do arquivo no bucket
      password: hashedPassword,
    }).returning({ id: users.id, email: users.email });

    const token = jwt.sign(user);
    reply.setCookie(APP_NAME.toLowerCase(), token)
  })
}
