import { env } from "./common/env";
import { createApp } from "./core";

export const app = await createApp();
const { APP_NAME, PORT } = env

app.listen({ port: PORT }, (err, port) => {
  if (err) return err
  console.log(`${APP_NAME} server running on :${port}`)
})
