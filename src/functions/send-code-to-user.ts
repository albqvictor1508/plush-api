import type { CreateUserParams, NewAccountTemporaryData } from "../types/auth";

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
	//"83991303948": {name: victor, code: "1649", phone: "83991303948", generatedAt: um numero imenso}
	codes[phone] = {
		name,
		code: generatedCode,
		phone,
		generatedAt: Date.now(),
	};

	//enviar SMS com código
	//salvar o código na memória por uns 5 minutos
	//validar código por sms
	//salvar user no banco
	//posso até redirecionar o usuário pra outra tela, ou deixo isso com o front
}
