import type { MultipartFile } from "@fastify/multipart";
import { eq } from "drizzle-orm";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { EventType } from "src/@types/ws";
import { getChatMedia, s3cli } from "src/common/bucket";
import { redis } from "src/common/cache";
import { Snowflake } from "src/common/snowflake";
import { STREAM_KEY } from "src/common/ws";
import { db } from "src/db/client";
import { files } from "src/db/schema/files";
import { users } from "src/db/schema/users";
import { createChat } from "src/functions/chats/create";
import z from "zod";

type FileExtension = "pdf" | "docx" | "jpg" | "png" | "webp" | "jpeg";

const createChatSchema = z.object({
  title: z.string(),
  ownerId: z.string(),
  description: z.string(),
});
export const route: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/chats",
    {
      schema: {
        summary: "Create chat route.",
        tags: ["chats"],
        consumes: ["multipart/form-data"],
      },
    },
    async (request, reply) => {
      const fields: Record<string, any> = {};

      let file: MultipartFile | null = null;
      let path =
        "https://pub-ddcbc3eda9ad4fa8a63869d92b1eab7c.r2.dev/wider_image.png"; //TODO: colocar uma foto real aq
      const parts = request.parts();
      //const { user } = app;
      //const { id: ownerId } = user;

      for await (const part of parts) {
        if (part.type !== "file") {
          console.log(part.fieldname);
          fields[part.fieldname] = part.value;
          continue;
        }

        console.log(part.filename);
        file = part;
      }

      try {
        createChatSchema.parse(fields);
      } catch (error: any) {
        return reply.code(400).send(error.message);
      }

      //@ts-expect-error
      const {
        title,
        description,
        ownerId,
        participants,
      }: {
        title: string;
        description: string;
        ownerId: string;
        participants: string;
      } = fields;

      //TODO: ver como fica a tratativa de erros padronizada
      let user: { id: string } | undefined;
      try {
        [user] = await db
          .select({ id: users.id })
          .from(users)
          .where(eq(users.id, ownerId));
        if (!user) return reply.code(404).send("Unknown User");
      } catch (error) {
        console.log(error);
        console.log(`error to get user: ${error}`);
        throw error;
      }
      const chatId = (await new Snowflake().create()).toString();

      let url: string;
      try {
        if (file) {
          const fileId = (await new Snowflake().create()).toString();

          path = getChatMedia(chatId, fileId, "profile", file.mimetype);
          const buffer = await file.toBuffer();

          await Promise.all([
            db.insert(files).values({
              id: fileId,
              extension: file.mimetype as FileExtension,
              sendedAt: new Date(),
            }),
            s3cli.file(path).write(buffer),
          ]);
        }

        url = s3cli.presign(path);
      } catch (error) {
        console.log(`error to save file: ${error}`);
        throw error;
      }

      const newParticipants = participants.split(",");

      const data = {
        id: chatId,
        avatar: url,
        title,
        description,
        ownerId,
        participants: newParticipants,
      };

      //@ts-expect-error
      const res = await createChat(data);
      if (typeof res === "object" && "error" in res)
        return reply.code(res.code as number).send(res.error);

      console.log(`DATA STRINGIFYED: ${JSON.stringify(data)}`);
      redis.send("XADD", [
        STREAM_KEY,
        "*",
        "type",
        EventType.CHAT_CREATED,
        "body",
        JSON.stringify(data),
      ]);

      return reply.code(201).send(res);
    },
  );
};
