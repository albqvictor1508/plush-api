import type { CreateUserParams, NewAccountTemporaryData } from "../types/auth";
import type { sendSms } from "../utils/send-email";

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

export async function sendCodeToUser({ name, email }: CreateUserParams) {
	const generatedCode = Math.random().toString().slice(2, 6);
	//"83991303948": {name: "victor", code: "1649", phone: "83991303948", generatedAt: um numero imenso}
	try {
		//depois eu analiso se tem possibilidade de rodar isso em paralelo pra ganho de performance
		await sendSms({ text: `Bom dia, ${generatedCode}`, email });
		codes[email] = {
			name,
			code: generatedCode,
			email,
			generatedAt: Date.now(),
		};
	} catch (e) {
		console.log(e);
	}
}
