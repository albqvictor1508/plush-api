import { betterAuth } from "better-auth";
import { createHash, randomBytes } from "node:crypto";
import { app } from "src/app";
import { env } from "src/common/env";

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

export const setupBetterAuth = async () => {
	return betterAuth({
		socialProviders: {
			google: {
				accessType: "offline",
				prompt: "select_account consent",
				clientId: env.GOOGLE_CLIENT_ID,
				clientSecret: env.GOOGLE_CLIENT_SECRET,
			},
		},
	});
};
