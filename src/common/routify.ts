import type { FastifyInstance } from "fastify";

export const routify = async (app: FastifyInstance): Promise<void> => {
	const children = new Bun.Glob("src/modules/**/**.ts").scan({
		absolute: true,
	});

	for await (const path of children) {
		const { route } = await import(path);
		if (typeof route !== "function") return;
		route(app);
	}
};
