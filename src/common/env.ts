import * as e from "envalid";

export const env = e.cleanEnv(process.env, {
  JWT_SECRET: e.str(),
  NODE_ENV: e.str({ default: "dev" }),

  DATABASE_URL: e.url(),

  REDIS_URL: e.str(),
  PORT: e.port(),
  APP_NAME: e.str(),

  //BUCKET_ACCESS_KEY_ID: e.str(),
  //BUCKET_SECRET_ACCESS_KEY: e.str(),

  GOOGLE_CLIENT_ID: e.str(),
  AUTH_SECRET: e.str(),
  GOOGLE_CLIENT_SECRET: e.str(),
});
