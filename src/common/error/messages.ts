import { ErrorCodes } from "./codes";

export const ErrorMessages: Record<ErrorCodes, string> = {
	[ErrorCodes.InternalServerError]: "Internal Server Error",
	[ErrorCodes.Unauthorized]: "Unauthorized",
	[ErrorCodes.Forbidden]: "Forbidden",
	[ErrorCodes.NotFound]: "Not Found",

	[ErrorCodes.EmailInUse]: "Email in use",
	[ErrorCodes.InvalidEmail]: "Invalid email",
	[ErrorCodes.UserCantDeleteChat]:
		"User must to be admin or owner to delete chat",

	[ErrorCodes.ErrorToCreateUser]: "Error to create user",
	[ErrorCodes.ErrorToCreateChat]: "Error to create chat",
	[ErrorCodes.ErrorToCreateChatParticipant]: "Error to create chat participant",
	[ErrorCodes.ErrorToCreateMessage]: "Error to create message",
	[ErrorCodes.ErrorToCreateSession]: "Error to create session",

	[ErrorCodes.UnknownUser]: "Unknown user",
	[ErrorCodes.UnknownChat]: "Unknown chat",
	[ErrorCodes.UnknownChatParticipant]: "Unknown chat participant",
	[ErrorCodes.UnknownMessage]: "Unknown message",
};

export const ErrorStatus: Record<ErrorCodes, number> = {
	[ErrorCodes.InternalServerError]: 500,
	[ErrorCodes.Unauthorized]: 401,
	[ErrorCodes.Forbidden]: 403,
	[ErrorCodes.NotFound]: 404,

	[ErrorCodes.EmailInUse]: 400,
	[ErrorCodes.InvalidEmail]: 400,
	[ErrorCodes.UserCantDeleteChat]: 403,

	[ErrorCodes.ErrorToCreateUser]: 500,
	[ErrorCodes.ErrorToCreateChat]: 500,
	[ErrorCodes.ErrorToCreateChatParticipant]: 500,
	[ErrorCodes.ErrorToCreateMessage]: 500,
	[ErrorCodes.ErrorToCreateSession]: 500,

	[ErrorCodes.UnknownUser]: 404,
	[ErrorCodes.UnknownChat]: 404,
	[ErrorCodes.UnknownChatParticipant]: 404,
	[ErrorCodes.UnknownMessage]: 404,
};
