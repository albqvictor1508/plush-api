export type CreateChatParams = {
	title: string;
	ownerId: string;
	participantId: string;
};

export enum Type {
	PRIVATE = "private",
	GROUP = "group",
}
