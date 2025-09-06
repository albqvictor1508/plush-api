import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { snowflake } from "src/common/snowflake";
import { db } from "src/db/client";
import { users } from "src/db/schema/users";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
  app.post("/sessions", {
    schema: {
      body: z.object({
        email: z.email({ error: "Invalid email." }),
        avatar: z.optional(z.string()),
        password: z.string({ error: "Invalid password." }).min(6, { error: "the password must to be greater than 6 characters" }), //usar o refine() pra validar senha com caracter especial e td email
      }),
      response: {
        201: z.void()
      }
    }
  }, async (request, reply) => {
    const { email, password, avatar } = request.body
    //salvar avatar no bucket
    //validar sessão do usuário

    const userByEmail = await db.select({ email: users.email }).from(users).where(eq(users.email, email));
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!userByEmail) return reply.send();
    const id = await snowflake()
    const user = await db.insert(users).values({
      id: id.toString(), //vai ser o id do snowflake
      email,
      avatar: "", //url do arquivo no bucket
      password: hashedPassword,
    }).returning({ id: users.id, email: users.email });
  })
}
