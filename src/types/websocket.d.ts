declare module "ws" {
	interface Websocket {
		user?: {
			id: string;
			email: string;
		};
	}
}
