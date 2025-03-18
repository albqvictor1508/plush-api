import { env } from "../common/env";
import AWS from "aws-sdk";

export async function sendSms({ message }: { message: string }) {
	const sns = new AWS.SNS();
	const params = {
		Message: message,
		PhoneNumber: env.MY_PHONE,
	};

	try {
		sns.publish(params);
	} catch (e) {
		console.log(e);
	}
}
