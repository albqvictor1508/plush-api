import { db } from "../../drizzle/client";
import { contacts } from "../../drizzle/schema/contacts";
import type { ContactSchema } from "../../types/contacts";

export async function createContact({ name, email, userId }: ContactSchema) {
	const contact = await db
		.insert(contacts)
		.values({ name, email, userId })
		.returning();
	return contact;
}
