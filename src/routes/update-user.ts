import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { parseCookie } from "../utils/parse-cookie";

export const updateUserRoute: FastifyPluginAsyncZod = async (app) => {
	app.put("/api/user", async (request, reply) => {
		const { id: userId } = await parseCookie(request.headers.cookie || "");
		const data = await request.file();
		if (!data) {
			const [user] = await db
				.select({ name: users.name, email: users.email })
				.from(users)
				.where(eq(users.id, userId));

			await uploadFile({
				userId,
				fileName,
				fileContent: fileBuffer,
				photoType: PhotoType.PROFILE,
			});

			const fileBuffer = await data?.toBuffer();

			return reply.status(200).send(user);
		}
		const { profileData } = data.fields;
		let parsedData: { name: string; email: string };
	});
};
