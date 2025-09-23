import { faker } from "@faker-js/faker";
import { Snowflake } from "../common/snowflake";
import { db, sql } from "./client";
import { chats, users, chatParticipants, messages, sessions } from "./schema";

async function main() {
	await db.delete(messages);
	await db.delete(chatParticipants);
	await db.delete(sessions);
	await db.delete(chats);
	await db.delete(users);

	const snowflake = new Snowflake();

	const usersToInsert = [];
	for (let i = 0; i < 10; i++) {
		usersToInsert.push({
			id: (await snowflake.create()).toString(),
			name: faker.internet.userName() + i,
			email: faker.internet.email() + i,
			avatar: faker.image.avatar(),
		});
	}
	const createdUsers = await db.insert(users).values(usersToInsert).returning();

	const chatsToInsert = [];
	for (let i = 0; i < 3; i++) {
		chatsToInsert.push({
			id: (await snowflake.create()).toString(),
			title: faker.lorem.words(3),
			description: faker.lorem.sentence(),
			avatar: faker.image.avatar(),
		});
	}
	const createdChats = await db.insert(chats).values(chatsToInsert).returning();

	console.log("👥 Adicionando participantes aos chats...");
	const participantsToInsert = [];

	if (createdChats.length > 0 && createdUsers.length >= 5) {
		for (let i = 0; i < 5; i++) {
			participantsToInsert.push({
				chatId: createdChats[0].id,
				userId: createdUsers[i].id,
				role: i === 0 ? "admin" : "member",
			});
		}
	}

	if (createdChats.length > 1 && createdUsers.length >= 8) {
		for (let i = 3; i < 8; i++) {
			participantsToInsert.push({
				chatId: createdChats[1].id,
				userId: createdUsers[i].id,
				role: "member",
			});
		}
	}

	if (participantsToInsert.length > 0) {
		await db.insert(chatParticipants).values(participantsToInsert);
	}

	const messagesToInsert = [];
	if (createdChats.length > 0 && createdUsers.length >= 2) {
		messagesToInsert.push(
			{
				id: (await snowflake.create()).toString(),
				chatId: createdChats[0].id,
				senderId: createdUsers[0].id,
				content: "Olá pessoal!",
				status: "sended",
			},
			{
				id: (await snowflake.create()).toString(),
				chatId: createdChats[0].id,
				senderId: createdUsers[1].id,
				content: "E aí, tudo bem?",
				status: "sended",
			},
		);
	}

	if (messagesToInsert.length > 0) {
		await db.insert(messages).values(messagesToInsert);
	}
}

main()
	.then(() => {
		console.log("✅ Processo de seed concluído com sucesso!");
	})
	.catch((err) => {
		console.error("❌ Erro durante o processo de seed:", err);
		process.exit(1);
	})
	.finally(async () => {
		await sql.end();
	});

