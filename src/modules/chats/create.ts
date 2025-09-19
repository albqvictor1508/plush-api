import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { EventType } from "src/@types/ws";
import { s3 } from "src/common/bucket";
import { redis } from "src/common/cache";
import { Snowflake } from "src/common/snowflake";
import { db } from "src/db/client";
import { users } from "src/db/schema/users";
import { createChat } from "src/functions/chats/create";
import z from "zod";

//rota multipart

export const route: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/chats",
    {
      schema: {
        consumes: ["multipart/form-data"],
        body: z.object({
          title: z.string(),
          ownerId: z.string(),
          avatar: z.file(),
          description: z.string(),
          participants: z.set(z.string()).min(1),
        }),
      },
    },
    async (request, reply) => {
      const { ownerId, avatar } = request.body;
      //const { user } = app;
      //const { id: ownerId } = user;

      const ownerExist = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, ownerId));
      if (!ownerExist) throw new Error("error"); //WARN: tratar erro

      const id = (await new Snowflake().create()).toString();
      s3.file(`${avatar.formData()}`);
      await s3.write(`${ownerId}/chats/${id}`, avatar);
      s3.file;

      const data = { id, ...request.body };

      await Promise.all([
        createChat(data),
        redis.send("XADD", [
          "stream:chat",
          "*",
          "type",
          EventType.CHAT_CREATED,
          "body",
          JSON.stringify(data),
        ]),
      ]);
    },
  );
};
