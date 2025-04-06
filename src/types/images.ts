export type UploadParams = {
	userId: string;
	type: PhotoType;
	fileName: string;
	fileContent: Buffer | string;
};

export enum PhotoType {
	STORY = "story",
	PROFILE = "profile",
	IMAGE = "image",
}
