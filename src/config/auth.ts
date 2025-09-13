import { createHash, randomBytes } from "node:crypto";
import * as openid from "openid-client";
import { app } from "src/app";
import { env } from "src/common/env";
//import { env } from "src/common/env";

interface GenerateAuthOptions {
  id: string;
  email: string;
}

const { jwt } = app;
const {
  AUTH0_CALLBACK_URL,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_DOMAIN,
} = env;

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

//TODO: """talvez""" eu mude pra betterauth no futuro
export const getAuthorizationData = async (provider?: string) => {
  const codeVerifier = openid.randomPKCECodeVerifier();
  const codeChallenge = await openid.calculatePKCECodeChallenge(codeVerifier);

  const config: openid.Configuration = await openid.discovery(
    new URL(`https://${AUTH0_DOMAIN}`),
    AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET,
  );

  const params: Record<string, string> = {
    redirectUri: env.AUTH0_CALLBACK_URL,
    scope: "openid profile email",
    codeChallenge,
    state: openid.randomState(),
    codeChallengeMethod: "S256",
  };

  if (provider) params.connection = provider;

  const redirectTo = openid.buildAuthorizationUrl(config, params);
  return { redirectTo: redirectTo.toString(), codeVerifier, codeChallenge };
};
