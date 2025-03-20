export type CreateUserParams = {
	name: string;
	phone: string;
};

export type NewAccountTemporaryData = {
	name: string;
	phone: string;
	code: string;
	generatedAt: number;
};

export type SendEmailParams = {
	message: string;
	email: string;
};

export type ValidateUserParams = { phone: string; code: string };
