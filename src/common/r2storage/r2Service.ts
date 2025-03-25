import s3 from "./r2Config";

// Nome do bucket (recuperado na variavel de ambiente )
const BUCKET_NAME = process.env.R2_BUCKET_NAME as string;

// Interface para os parametros de upload
interface UploadParams {
    fileName: string;
    fileContent: Buffer | string;
}

// Função para upload de arquivo
export const uploadFile = async ({ fileName, fileContent }: UploadParams ): Promise<string> => {
    try {
        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: fileContent,
            ACL: "private", // 'public-read' para acesso publico
        };
    

        const result = await s3.upload(params).promise();
        return result.Location;
    } catch (error) {
        console.error("Erro no upload do arquivo:", error);
        throw new Error("Falha ao fazer upload do arquivo.")
    }
};

// Gerar URL do arquivo armanzenado
export const getFileUrl = (fileName: string): string => {
    return `https://${BUCKET_NAME}.${process.env.R2_ENDPOINT}/${fileName}`;
}