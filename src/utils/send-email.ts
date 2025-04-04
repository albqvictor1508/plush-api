import { createTransport } from "nodemailer";
import type { SendEmailParams } from "../types/auth";
import { env } from '../common/env';

export const handleSendEmail = async ({
	subject,
	email,
	html,
	text,
}: SendEmailParams) => {
	if (!email) {
		throw new Error("missing email on send email function");
	}

	try {
		const transport = createTransport({
			host: "smtp.gmail.com",
			service: "gmail",
			port: 465,
			secure: true, //true pra 465 e false pra qualquer outra porta (ta nas docs do nodemailer)
			auth: {
				user: env.MY_GMAIL,
				pass: env.MY_GMAIL_PASSWORD,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		await transport.sendMail({
			from: `Plush <${env.MY_GMAIL}>`,
			to: email,
			subject,
			html,
			text,
		});
	} catch (error) {
		console.log(error);
		return error;
	}
};
