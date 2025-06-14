import fastify from "fastify";
import jwt from "@fastify/jwt";
import { fastifyCookie } from "@fastify/cookie";
import { fastifyCors } from "@fastify/cors";
import {
	type ZodTypeProvider,
	validatorCompiler,
	serializerCompiler,
} from "fastify-type-provider-zod";
import { env } from "./common/env";
import { createUserRoute } from "./routes/auth/new-user-route";
import { sendCodeToUserRoute } from "./routes/auth/send-code-route";
import { createChatRoute } from "./routes/chats/create-chat-route";
import chalk from "chalk";
import { listChatsByUserRoute } from "./routes/chats/list-chats-by-user-route";
import fastifyMultipart from "@fastify/multipart";
import { getProfileRoute } from "./routes/profile/@me";
import { updateUserRoute } from "./routes/update-user";
import { toggleUserRoleRoute } from "./routes/chats/toggle-user-role-route";
import { deleteMessageRoute } from "./routes/messages/delete-message";
import { updateMessageRoute } from "./routes/messages/update-message";
import { CreateGroupRoute } from "./routes/chats/create-group";
import { LeaveGroupRoute } from "./routes/chats/leave-group";
import { SearchByContentRoute } from "./routes/messages/search-by-content";
import {CreateContactRoute} from "./routes/contacts/create-contact"
import {DeleteContactRoute} from "./routes/contacts/delete-contact"
import {SearchContactByNameRoute} from "./routes/contacts/search-by-name"
import {UpdateContactRoute} from "./routes/contacts/update-contact"

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
app.register(toggleUserRoleRoute);
app.register(CreateGroupRoute);
app.register(LeaveGroupRoute);
app.register(SearchByContentRoute);
app.register(CreateContactRoute);
app.register(DeleteContactRoute);
app.register(SearchContactByNameRoute);
app.register(UpdateContactRoute);

app
	.listen({ port: env.PORT })
	.then(() => {
		console.log(chalk.blueBright("HTTP/Websocket Server running!"));
	})
	.catch((e) => {
		console.log(e);
	});
