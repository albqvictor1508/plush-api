import { eq } from "drizzle-orm";
import { db } from "../drizzle/client";
import { chatParticipants } from "../drizzle/schema";
import type { ToggleUserRoleParams } from "../types/chats";

export async function toggleUserRole({
	userId,
}: ToggleUserRoleParams): Promise<void> {
	const [role] = await db
		.select({ role: chatParticipants.role })
		.from(chatParticipants)
		.where(eq(chatParticipants.userId, userId));
}
