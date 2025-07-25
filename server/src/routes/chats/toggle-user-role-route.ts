import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { parseCookie } from "../../utils/parse-cookie";
import { toggleUserRole } from "../../functions/user/toggle-user-role.ts";
import { z } from "zod";

export const toggleUserRoleRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/api/admin",
    {
      schema: {
        body: z.object({
          participantId: z.string().uuid(),
          chatId: z.number().positive(),
        }),
      },
    },
    async (request, reply) => {
      const { id: userId } = await parseCookie(request.headers.cookie || "");
      const { participantId } = request.body;

      await toggleUserRole({ userId, participantId });
      //setar um intervalo de tempo entre uma requisição e outra (pro cara n ta colocando e tirando o admin direto)
    },
  );
};
