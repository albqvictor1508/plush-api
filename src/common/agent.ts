import { parse as getAgent } from "useragent";

export const verifyAgent = (auth?: string) => {
  if (!auth) throw new Error("tratar erro"); //WARN: tratar erro
  const agent = getAgent(auth);
  if (agent.family === "Other") throw new Error("tratar erro"); //WARN: tratar erro

  return agent;
};
