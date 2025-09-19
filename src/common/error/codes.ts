export enum ErrorCodes {
	InternalServerError = 1001,
	ErrorToCreateChat = 1002,
	ErrorToCreateSession = 1003,
	ErrorToCreateUser = 1004,
	ErrorToCreateChatParticipant = 1005,
	ErrorToCreateMessage = 1006,

	Unauthorized = 2001,
	Forbidden = 2002,
	NotFound = 2003,

	InvalidEmail = 3001,
	EmailInUse = 3003,
	UserCantDeleteChat = 3004,

	UnknownUser = 4001,
	UnknownChat = 4002,
	UnknownMessage = 4003,
	UnknownChatParticipant = 4004,
}
