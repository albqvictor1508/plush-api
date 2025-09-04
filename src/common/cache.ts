import Redis from "ioredis";
import { env } from "./env";

const REDIS_HOST = env.NODE_ENV === "prod" ? env.REDIS_HOST : "127.0.0.1"

export const redis = new Redis({ host: REDIS_HOST, port: env.REDIS_PORT })
