import { ErrorCodes } from "./codes";

export const ErrorMessages: Record<ErrorCodes, string> = {
  [ErrorCodes.InternalServerError]: "Internal Server Error",
  [ErrorCodes.Unauthorized]: "Unauthorized",
  [ErrorCodes.Forbidden]: "Forbidden",
  [ErrorCodes.NotFound]: "Not Found",

  [ErrorCodes.EmailInUse]: "Email in use",
  [ErrorCodes.InvalidEmail]: "Invalid email",

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
