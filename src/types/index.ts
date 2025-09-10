export type JWTPayload = {
	id: string;
	email: string;
};

export type User = {
	authId?: string;
	email: string;
	password: string;
	avatar: string;
	name: string;
};

export interface UserMetadata {
	browser: string;
	ip: string;
	os: string;
}
