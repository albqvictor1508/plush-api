import { chatParticipants, chats, messages, users } from "./schema";
import { db } from "./client";
import { faker } from "@faker-js/faker";
import chalk from "chalk";

const clearDatabase = async () => {
	await db.delete(users);
	await db.delete(chats);
	await db.delete(messages);
	await db.delete(chatParticipants);
};
clearDatabase();

await db.insert(users).values([
	{
		name: faker.person.fullName(),
		email: faker.internet.email(),
	},
	{
		name: faker.person.fullName(),
		email: faker.internet.email(),
	},
	{
		name: faker.person.fullName(),
		email: faker.internet.email(),
	},
	{
		name: faker.person.fullName(),
		email: faker.internet.email(),
	},
]);

console.log(chalk.yellow("Database seeded successfully."));
