import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { EventType } from "src/@types/ws";
import { getChatAvatar, s3 } from "src/common/bucket";
import { redis } from "src/common/cache";
import { Snowflake } from "src/common/snowflake";
import { STREAM_KEY } from "src/common/ws";
import { db } from "src/db/client";
import { users } from "src/db/schema/users";
import { createChat } from "src/functions/chats/create";
import z from "zod";

export const route: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/chats",
    {
      preValidation: (request, reply, done) => {
        const body = request.body;
        const newBody: { [key: string]: any } = {};

        for (const key in body) {
          //@ts-expect-error
          const part = body[key];

          if (part.file) {
            newBody[key] = part;
            continue;
          }

          if (key === "participants" && typeof part.value === "string") {
            newBody[key] = new Set(
              part.value.split(",").map((s: string) => s.trim()),
            );
            continue;
          }

          newBody[key] = part.value;
        }

        //@ts-expect-error
        request.body = newBody;
        done();
      },
      schema: {
        summary: "Create chat route.",
        tags: ["chats"],
        consumes: ["multipart/form-data"],
        body: z.object({
          title: z.string(),
          // @ts-ignore - O tipo file é provido pelo plugin, mas z.any() é mais seguro aqui
          file: z.any(),
          description: z.string(),
          participants: z.set(z.string()).min(1),
        }),
      },
    },
    async (request, reply) => {
      const { file } = request.body;

      //const { user } = app;
      //const { id: ownerId } = user;

      const id = (await new Snowflake().create()).toString();
      const buffer = await file.arrayBuffer();
      const path = getChatAvatar(id);

      const meta = s3.file(path);

      await s3.write(await meta.json(), buffer);
      const url = meta.presign({
        acl: "public-read", //LER SOBRE ISSO
        expiresIn: 60 * 60 * 24,
      });

      const data = { id, avatar: url, ...request.body };
      const [response] = await Promise.all([
        createChat(data),
        redis.send("XADD", [
          STREAM_KEY,
          "*",
          "type",
          EventType.CHAT_CREATED,
          "body",
          JSON.stringify(data),
        ]),
      ]);

      if (typeof response === "object" && "error" in response)
        return reply.code(response.code as number).send(response.error);

      return reply.code(201);
    },
  );
};
