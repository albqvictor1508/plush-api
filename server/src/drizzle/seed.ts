import { chatParticipants, chats, messages, users } from "./schema";
import { db } from "./client";
import { faker } from "@faker-js/faker";
import chalk from "chalk";
export async function seed() {
  try {
    const clearDatabase = async () => {
      await db.delete(users);
      await db.delete(chats);
      await db.delete(messages);
      await db.delete(chatParticipants);
    };

    await clearDatabase();

    const insertDatabase = async () => {
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
    };
    await insertDatabase();
    console.log(chalk.yellow("Database seeded successfully."));
  } catch (error) {
    console.error(error);
    throw error;
  }
}


