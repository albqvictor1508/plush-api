import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import {z} from "zod";
import { createChat } from "../../functions/create-chat";
import { db } from "../../drizzle/client";
import { eq, exists } from "drizzle-orm";
import { users } from "../../drizzle/schema";

export const CreateGroupRoute: FastifyPluginAsyncZod = async(app) => {
    app.post("/api/groups", {
        schema: {
            body: z.object({
                title: z.string(),
                createdBy: z.string().uuid(),
                participantsId: z.array(z.string().uuid()),
                photoUrl: z.string().url().optional()
            })
        }
    },async (request, reply) => {
        const {title,createdBy,participantsId,photoUrl} = request.body;
        for(const participantId of participantsId) {
            const [participantExists] = await db
            .select({exists: exists(users)})
            .from(users)
            .where(eq(users.id, participantId));

            if(!participantExists) return reply.status(400).send(`the user with id: ${participantId} not exists`);
        }
        const group = createChat({title, participantsId, ownerId: createdBy});
    })
}