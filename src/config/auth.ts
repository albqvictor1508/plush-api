import { createHash, randomBytes } from "node:crypto";
import * as client from "openid-client";
import { app } from "src/app";
import { env } from "src/common/env";
//import { env } from "src/common/env";

interface GenerateAuthOptions {
  id: string;
  email: string;
}

const { jwt } = app;
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = env;

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

export const setupOpenID = async () => {
  let state = "";
  let scope = "";

  const codeVerifier = client.randomPKCECodeVerifier();
  const codeChallenge = await client.calculatePKCECodeChallenge(codeVerifier);
  const config: client.Configuration = await client.discovery(
    new URL(""),
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
  );

  const params: Record<string, string> = {
    redirectUri: "",
    scope,
    codeChallenge,
    codeChallengeMethod: "S256",
  };

  if (!config.serverMetadata().supportsPKCE()) {
    state = client.randomState();
    params.state = state;
  }

  const redirectTo = client.buildAuthorizationUrl(config, params);
};
