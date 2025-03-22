import type { FastifyPluginAsync } from "fastify";

export const sendMessageRoute: FastifyPluginAsync = async (app) => {
	app.get("/api/messages/send", async (request, reply) => {
		reply.cookie("jwt", token);
	});
};
