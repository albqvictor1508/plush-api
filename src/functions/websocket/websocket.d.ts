declare module "ws" {
	interface WebSocket {
		user?: {
			id: string;
			email: string;
		};
	}
}
