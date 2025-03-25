import type { CreateUserParams, NewAccountTemporaryData } from "../types/auth";
import { handleSendEmail } from "../utils/send-email";

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
	try {
		const emailSubject = "Seu código de verificação";
		const emailText = `Bom dia, ${name}! Seu código de verificação é: ${generatedCode}`;
		await Promise.all([
			await handleSendEmail({
				subject: emailSubject,
				email,
				text: emailText,
				message: emailText,
			}),
			// biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
			(codes[email] = {
				name,
				code: generatedCode,
				email,
				generatedAt: Date.now(),
			}),
			//"myemail@gmail.com": {name: "victor", code: "1649", email: "myemail@gmail.com", generatedAt: um numero imenso}
		]);
	} catch (e) {
		console.log(e);
	}
}
