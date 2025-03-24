import type { FastifyPluginAsync } from "fastify";

export const sendMessageRoute: FastifyPluginAsync = async (app) => {
	app.get(
		"/api/messages/send",
		{ websocket: true },
		async (socket, request) => {
			socket.on("message", (data) => {});
		},
	);
};
