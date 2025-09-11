import chalk from "chalk";
import { env } from "./common/env";
import { routify } from "./common/routify";
import { createApp } from "./core/index.ts";

export const app = await createApp();
const { APP_NAME, PORT } = env;

await routify(app);

app.listen({ port: PORT }, async (err) => {
  if (err) return err;

  (app as any).readyAt = new Date();

  console.log(chalk.yellow(`${APP_NAME} server running on :${PORT}`));
});
