import { checkFileExists } from "./upload-file";

export const getFileUrl = ({ fileName, photoType, userId }): string | null => {
	const fullPath = `${userId}/${photoType}/${fileName}`;
	if (!checkFileExists(fullPath))
		throw new Error("This file not exists or not finded on bucket");
	return fullPath;
};
