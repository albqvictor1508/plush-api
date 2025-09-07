import { createHash, randomBytes } from "node:crypto";
import { app } from "src/app";

interface GenerateAuthOptions {
	id: string;
	email: string;
}

const { jwt } = app;

export async function generateAccessToken(data: GenerateAuthOptions) {
	return jwt.sign(data, { expiresIn: "15m" });
}

export const generateRefreshToken = () => {
	const token = randomBytes(40).toString("hex");
	return {
		token,
		hash: hashRefreshToken(token),
	};
};

export const hashRefreshToken = (token: string) => {
	return createHash("sha256").update(token).digest("hex");
};
