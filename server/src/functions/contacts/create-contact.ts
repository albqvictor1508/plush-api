import { db } from "../../drizzle/client";
import { contacts } from "../../drizzle/schema/contacts";
import type { ContactSchema } from "../../types/contacts";

export async function createContact({
	name,
	email,
	userId,
	photoUrl,
	isFixed,
}: ContactSchema) {
	const [contact] = await db
		.insert(contacts)
		.values({ name, email, userId, photoUrl: photoUrl || "", isFixed })
		.returning();
	return contact;
}
