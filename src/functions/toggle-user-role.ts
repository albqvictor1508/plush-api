import { eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { chatParticipants, users } from "../drizzle/schema";
import type { ToggleUserRoleParams } from "../types/chats";
import chalk from "chalk";

export async function toggleUserRole({
	userId,
	participantId,
}: ToggleUserRoleParams): Promise<{ id: string; role: string }> {
	const [user] = await db
		.select({ role: chatParticipants.role })
		.from(chatParticipants)
		.where(eq(chatParticipants.userId, userId));

	if (!user) {
		throw new Error(
			chalk.red(`USER NOT EXISTS OR NOT FOUNDED: ${new Error().message}`),
		);
	}

	if (user.role !== "admin") {
		throw new Error(
			chalk.red(
				`${"You must to be admin to toggle participant role".toUpperCase()}: ${new Error().message}`,
			),
		);
	}
	const [participant] = await db
		.select({ id: chatParticipants.userId, role: chatParticipants.role })
		.from(chatParticipants)
		.where(eq(chatParticipants.userId, participantId));

	const newRole = participant.role === "admin" ? "member" : "admin";

	await db.update(chatParticipants).set({ role: newRole });

	return participant;
}
