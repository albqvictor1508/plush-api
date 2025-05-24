import { db } from "../../drizzle/client";
import { users } from "../../drizzle/schema";
import type { NewAccountTemporaryData } from "../../types/auth";
import { codes } from "../send-code-to-user";

export async function createUser({ email }: { email: string }) {
	const setting: NewAccountTemporaryData = codes[email]; //vai puxar as informações do usuário que eu salvei na outra função

	const result = await db
		.insert(users)
		.values({ name: setting.name, email: setting.email })
		.returning();
	//insert em um banco de dados geralmente não retorna nada, esse returning faz com que ele retorne os dados que foram inseridos, mas eles retornam em um array, então pego o unico indice do array, que é os dados do usuário, pra retornar ele fora de um array
	return result[0];
}
