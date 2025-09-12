import chalk from "chalk";
import { env } from "./common/env";
import { routify } from "./common/routify";
import { createApp } from "./core/index.ts";

export const app = await createApp();
const { APP_NAME, PORT } = env;

await routify(app);

app.listen({ port: PORT }, (err) => {
	if (err) return err;

	const name = APP_NAME.replace(
		APP_NAME.charAt(0),
		APP_NAME.charAt(0).toUpperCase(),
	);

	(app as any).readyAt = new Date();
	console.log(chalk.yellow(`${name} server running on :${PORT}`));
});
