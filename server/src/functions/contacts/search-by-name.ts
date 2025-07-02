import { ilike } from "drizzle-orm"
import {db} from "../../drizzle/client"
import { users} from "../../drizzle/schema"

export async function SearchContactByName(name:string) {
    const usersList = await db.select().from(users).where(ilike(users.name, name));
    return usersList;
}