import { env } from "./common/env";
import { routify } from "./common/routify";
import { createApp } from "./core";

const app = await createApp();
const { APP_NAME, PORT } = env

await routify(app)

app.listen({ port: PORT }, (err) => {
  if (err) return err
  console.log(`${APP_NAME} server running on :${PORT}`)
})
