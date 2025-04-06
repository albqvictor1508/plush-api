import s3 from "../common/r2storage/r2Config";
import { env } from "../common/env";

// Nome do bucket
const BUCKET_NAME = env.R2_BUCKET_NAME;

// Interface para os parâmetros de upload
interface UploadParams {
  fileName: string;
  fileContent: Buffer | string;
}

// Função para upload de arquivo
export const uploadFile = async ({ fileName, fileContent }: UploadParams): Promise<string> => {
  try {
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: fileContent,
      ACL: "private",
    };

    const result = await s3.upload(params).promise();
    return result.Location; // Retorna a URL do arquivo armazenado
  } catch (error) {
    console.error("Erro no upload do arquivo:", error);
    throw new Error("Falha ao fazer upload do arquivo.");
  }
};

// Função para gerar URL do arquivo armazenado
export const getFileUrl = (fileName: string): string => {
  return `https://${BUCKET_NAME}.${env.R2_ENDPOINT}/${fileName}`;
};
