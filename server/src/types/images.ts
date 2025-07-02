export type UploadParams = {
	userId: string;
	photoType: PhotoType;
	fileName: string;
	fileContent: Buffer | string;
};

export type GetFileUrlParams = {
	fileName: string;
	photoType: string;
	userId: string;
};

export enum PhotoType {
	STORY = "story",
	PROFILE = "profile",
	IMAGE = "image",
}
