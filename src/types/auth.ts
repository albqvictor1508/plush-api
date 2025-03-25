export type CreateUserParams = {
	name: string;
	email: string;
};

export type NewAccountTemporaryData = {
	name: string;
	email: string;
	code: string;
	generatedAt: number;
};

export type SendEmailParams = {
	subject?: string;
	html?: string;
	text: string;
	message: string;
	email: string;
};

export type ValidateUserParams = { email: string; code: string };
