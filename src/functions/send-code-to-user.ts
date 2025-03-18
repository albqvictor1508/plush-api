import type { CreateUserParams, NewAccountTemporaryData } from "../types/auth";
import { sendSms } from "../utils/sendSms";
import { createUser } from "./create-user";

export const codes = {} as Record<string, NewAccountTemporaryData>;
const ONE_SECOND_IN_MS = 1000;
const FIVE_MINUTES_IN_MS = 1000 * 300;

setInterval(() => {
	for (const code in codes) {
		if (Date.now() - FIVE_MINUTES_IN_MS > codes[code].generatedAt) {
			delete codes[code];
		}
	}
}, ONE_SECOND_IN_MS);

export async function sendCodeToUser({ name, phone }: CreateUserParams) {
	const generatedCode = Math.random().toString().slice(2, 6);
	//"83991303948": {name: "victor", code: "1649", phone: "83991303948", generatedAt: um numero imenso}
	await sendSms({ message: `Bom dia, ${generatedCode}` });
	codes[phone] = {
		name,
		code: generatedCode,
		phone,
		generatedAt: Date.now(),
	};

	return await createUser({ phone });
}
