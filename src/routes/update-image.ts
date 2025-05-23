import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

export const updateImage: FastifyPluginAsyncZod = async (app) => {
	app.post("/api/images");
};
