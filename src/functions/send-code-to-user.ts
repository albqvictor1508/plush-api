import type { CreateUserParams, NewAccountTemporaryData } from "../types/auth";

export const codes: Map<string, NewAccountTemporaryData> = {};

export async function sendCodeToUser({ name, phone }: CreateUserParams) {
	//enviar SMS com código
	//salvar o código na memória por uns 5 minutos
	//validar código por sms
	//salvar user no banco
	//posso até redirecionar o usuário pra outra tela, ou deixo isso com o front
}
