import { RedisClient } from "bun";
import { isProd } from "src/core";
import { env } from "./env";

const REDIS_URL = isProd ? env.REDIS_URL : "redis://localhost:4444/plush";

export const redis = new RedisClient(REDIS_URL);
