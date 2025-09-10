import { parse as getAgent } from "useragent";

export const verifyAgent = (auth: string) => {
	const agent = getAgent(auth);
	if (agent.family === "Other") return "error"; //WARN: tratar erro

	return agent;
};
