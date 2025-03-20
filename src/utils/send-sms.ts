import { Vonage } from "@vonage/server-sdk";
import { env } from "../common/env";
import type { SMSParams } from "../types/sms";
export async function sendSms({ phone, text }: SMSParams) {
	const vonage = new Vonage({
		apiKey: env.VONAGE_API_KEY,
		apiSecret: env.VONAGE_API_SECRET,
	});

	const sms = await vonage.sms.send({ to: phone, from: "Plush", text });
	return sms;
}
