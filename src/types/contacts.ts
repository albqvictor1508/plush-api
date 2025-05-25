import { contacts } from "../drizzle/schema";

export type ContactSchema = {
	name: string;
	email: string;
	userId: string;
	isFixed: boolean;
	photoUrl?: string;
};

export type PartialContact = Partial<ContactSchema>;
