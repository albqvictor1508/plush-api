import { db } from "../drizzle/client";
import { users } from "../drizzle/schema/users";
import type { NewAccountTemporaryData } from "../types/auth";
import { codes } from "./send-code-to-user";

const ONE_SECOND_IN_MS = 1000;
const FIVE_MINUTES_IN_MS = 1000 * 300;

setInterval(() => {
	for (const code in codes) {
		if (Date.now() - FIVE_MINUTES_IN_MS > codes[code].generatedAt) {
			delete codes[code];
		}
	}
}, ONE_SECOND_IN_MS);
//a cada 1 segundo, ele vai chegar o tempo, se passar de 5 minutos, eu deleto o código do cara

export async function CreateUser({ phone }: { phone: string }) {
	const setting: NewAccountTemporaryData = codes[phone]; //vai puxar as informações do usuário que eu salvei na outra função

	const user = await db
		.insert(users)
		.values({ name: setting.name, phone: setting.phone });

	return user;
}
