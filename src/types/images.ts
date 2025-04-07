import type { UUID } from "node:crypto";

export type UploadParams = {
	userId: UUID;
	photoType: PhotoType;
	fileName: string;
	fileContent: Buffer | string;
};

export enum PhotoType {
	STORY = "story",
	PROFILE = "profile",
	IMAGE = "image",
}
