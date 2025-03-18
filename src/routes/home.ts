import type { FastifyPluginAsync } from "fastify";

export const home: FastifyPluginAsync = async (app) => {
	app.get("/", (request, reply) => {
		return reply.send("vai toma no cu ariel");
	});
};
