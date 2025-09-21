import { randomUUID } from "node:crypto";
import { EventType } from "src/@types/ws";
import { redis } from "src/common/cache";
import { db } from "src/db/client";
import { messages } from "src/db/schema/messages";
import { chatConnections } from "src/modules/ws";

const key = `stream:chats`; //por enquanto será 1 só key e a validação vai ser feita dentro do payload
const group = "lume_api_group"; //grupo de workers que vão ler essa mensagem
const consumer = `consumer-${randomUUID()}`; //cada membro do chat

export const persistMessages = async () => {
	while (true) {
		const res = await redis.send("XREADGROUP", []); //TODO: PASSAR AS PARADA AQ

		if (!res) continue;

		for (const [_, msgs] of res) {
			for (const [_, fields] of msgs) {
				const [_, raw] = fields;
				const msg = await JSON.parse(raw);

				const { id, chatId, content, senderId, status, photo, sendedAt } = msg;

				await db.insert(messages).values({
					id,
					chatId,
					content,
					senderId,
					status,
					photo,
					sendedAt,
				});
				await redis.send("XACK", [`chat:${chatId}`, group, id]);
			}
		}
		//percorrer pelos dados enviados no evento, que provavelmente vai ser um array
		//de msgs enfileiradas, e ir adicionando uma por uma no banco enquanto o outro
		//worker distribue essas mensagens
	}
	//salvar no banco e enviar via redis um "XACK" pra avisar que consumiu os
	//dados
};
export const broadcastMessages = async () => {
	while (true) {
		const res = await redis.send("XREADGROUP", [
			"GROUP",
			group,
			consumer,
			"BLOCK",
			"5000",
			"COUNT",
			"10",
			"STREAMS",
			key,
			">",
		]);

		if (!res) continue;

		for (const [streamKey, msgs] of res) {
			for (const [_, fields] of msgs) {
				const [id, raw] = fields;
				const msg = JSON.parse(raw);

				const { chatId } = msg;
				const clients = chatConnections.get(chatId);
				if (clients) {
					for (const cli of clients) {
						if (cli.readyState === 1) {
							cli.send(
								JSON.stringify({
									type: EventType.MESSAGE_CREATED,
									body: msg,
								}),
							);
						}
					}
				}

				await redis.send("XACK", [streamKey, group, id]);
			}
		}
	}
};
