import { env } from "../common/env";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
export async function sendSms({ message }: { message: string }) {
	const sns = new SNSClient({
		region: "sa-east-1",
		credentials: {
			accessKeyId: env.AWS_ACCESS_KEY_ID,
			secretAccessKey: AWS_SECRET_ACCESS_KEY,
		},
	});
	const params = {
		Message: message,
		PhoneNumber: env.MY_PHONE,
	};
	await sns.send(new PublishCommand(params));
}
