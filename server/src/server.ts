import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import jwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import chalk from "chalk";
import fastify from "fastify";
import {
  type ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./common/env";
import { seed } from "./drizzle/seed.ts";
import { createUserRoute } from "./routes/auth/new-user-route";
import { sendCodeToUserRoute } from "./routes/auth/send-code-route";
import { createChatRoute } from "./routes/chats/create-chat-route";
import { CreateGroupRoute } from "./routes/chats/create-group";
import { LeaveGroupRoute } from "./routes/chats/leave-group";
import { listChatsByUserRoute } from "./routes/chats/list-chats-by-user-route";
import { toggleUserRoleRoute } from "./routes/chats/toggle-user-role-route";
import { CreateContactRoute } from "./routes/contacts/create-contact";
import { DeleteContactRoute } from "./routes/contacts/delete-contact";
import { SearchContactByNameRoute } from "./routes/contacts/search-by-name";
import { UpdateContactRoute } from "./routes/contacts/update-contact";
import { deleteMessageRoute } from "./routes/messages/delete-message";
import { SearchByContentRoute } from "./routes/messages/search-by-content";
import { updateMessageRoute } from "./routes/messages/update-message";
import { getProfileRoute } from "./routes/profile/@me";
import { updateUserRoute } from "./routes/update-user";
import { sendMessageRoute } from "./routes/messages/send-message.ts";

export const app = fastify().withTypeProvider<ZodTypeProvider>();
app.register(fastifyCors, { credentials: true });
app.register(jwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: "plush_auth",
    signed: false,
  },
});
app.register(fastifyCookie, { secret: env.COOKIE_SECRET });
app.register(fastifyMultipart, {
  limits: { fileSize: 10 * 1024 * 1024 }, //10 MB
});

app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

app.register(sendCodeToUserRoute);
app.register(createUserRoute);
app.register(createChatRoute);
app.register(listChatsByUserRoute);
app.register(getProfileRoute);
app.register(updateUserRoute);
app.register(deleteMessageRoute);
app.register(updateMessageRoute);
app.register(sendMessageRoute);
app.register(toggleUserRoleRoute);
app.register(CreateGroupRoute);
app.register(LeaveGroupRoute);
app.register(SearchByContentRoute);
app.register(CreateContactRoute);
app.register(DeleteContactRoute);
app.register(SearchContactByNameRoute);
app.register(UpdateContactRoute);

await seed();

app
  .listen({ port: env.PORT })
  .then(() => {
    console.log(chalk.blueBright(`"HTTP/Websocket Server running on ${env.PORT}!"`));
  })
  .catch((e) => {
    console.error(e);
  });
