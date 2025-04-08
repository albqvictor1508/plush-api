export type UploadParams = {
	userId: string;
	photoType: PhotoType;
	fileName: string;
	fileContent: Buffer | string;
};

export enum PhotoType {
	STORY = "story",
	PROFILE = "profile",
	IMAGE = "image",
}
