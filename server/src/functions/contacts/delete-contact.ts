import { db } from "../../drizzle/client";
import {contacts} from "../../drizzle/schema/contacts"
import {eq, exists} from "drizzle-orm"

export async function DeleteContact(email: string): Promise<boolean> {
    const existsByEmail = await db
    .select({exists: exists(contacts)}).
    from(contacts)
    .where(eq(contacts.email, email));

    if(!existsByEmail) return false;
    await db.delete(contacts).where(eq(contacts.email, email));
    return true;
}