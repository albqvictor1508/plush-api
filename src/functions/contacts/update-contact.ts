import { eq } from "drizzle-orm";
import {db} from "../../drizzle/client";
import {contacts} from "../../drizzle/schema"
import {PartialContact} from "../../types/contacts"

export async function updateContact(contactId:number, contactParam: PartialContact) {
    const updatedContact = await db.update(contacts).set({...contactParam, updatedAt: new Date()}).where(eq(contacts.id, contactId)).returning();
    return updatedContact;
}