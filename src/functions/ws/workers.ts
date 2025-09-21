import { redis } from "src/common/cache";
import { randomUUID } from "node:crypto";

const key = `stream:chat`; //nome da queue (vai ser importante quando tiver outras filas como de notification e td mais)
const group = "lume_api_group"; //cada chat (grupo de consumers)
const consumer = `consumer-${randomUUID()}`; //cada membro do chat

export const persistMessages = async () => {
	while (true) {
		const res = redis.send("XREADGROUP", []);

		if (!res) continue;

		//percorrer pelos dados enviados no evento, que provavelmente vai ser um array
		//de msgs enfileiradas, e ir adicionando uma por uma no banco enquanto o outro
		//worker distribue essas mensagens
	}
	//salvar no banco e enviar via redis um "XACK" pra avisar que consumiu os
	//dados
	//
	//
};
export const listenMessages = async () => {
	//ouvir as mensagens
};
