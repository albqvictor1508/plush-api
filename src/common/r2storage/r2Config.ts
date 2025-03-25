import AWS from "aws-sdk";
import dotenv from "dotenv";

// Carregar variáveis de ambiente
dotenv.config();

// Criar cliente S3 para conexão com Cloudflare R2 Storage
const s3 = new AWS.S3({
  endpoint: process.env.R2_ENDPOINT, // URL do Cloudflare R2
  accessKeyId: process.env.R2_ACCESS_KEY, // Token Service como Access Key
  secretAccessKey: process.env.R2_SECRET_KEY, // Token Service como Secret Key
  signatureVersion: "v4",
});

export default s3;
