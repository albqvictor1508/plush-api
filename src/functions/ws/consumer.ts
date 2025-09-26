import { redis } from "src/common/cache";
import {
	broadcast,
	connections,
	CONSUMER_NAME,
	GROUP_NAME,
	STREAM_KEY,
} from "src/common/ws";

export async function consumeEvents() {
	console.log(
		`[Consumer] Starting consumer ${CONSUMER_NAME} for group ${GROUP_NAME}...`,
	);

	try {
		await redis.send("XGROUP", [
			"CREATE",
			STREAM_KEY,
			GROUP_NAME,
			"$",
			"MKSTREAM", //upsert (if not exist stream, he create him)
		]);
		console.log(`[Consumer] Group '${GROUP_NAME}' created or already exists.`);
	} catch (error: any) {
		if (!error.message.includes("BUSYGROUP")) {
			console.error("[Consumer] Failed to create consumer group:", error);
			return;
		}
	}

	console.log("[Consumer] Waiting for events...");
	while (true) {
		try {
			const response = await redis.send("XREADGROUP", [
				"GROUP",
				GROUP_NAME,
				CONSUMER_NAME,
				"BLOCK",
				"0", // block indefinitely until a message arrives
				"STREAMS",
				STREAM_KEY,
				">", // Read new messages that haven't been delivered to any consumer yet
			]);

			if (!response) return;

			console.log(response);
			broadcast(connections.keys().toArray(), response);

			console.log(`RESPONSE: ${JSON.stringify(response)}`);
		} catch (error) {
			console.error("[Consumer] Error reading from stream:", error);
			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}
}

consumeEvents();
