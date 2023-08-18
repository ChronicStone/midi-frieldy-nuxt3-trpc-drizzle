import { PutObjectCommand, S3Client as _S3CLient } from '@aws-sdk/client-s3';
import { env } from '@/server/env';

const S3Client = new _S3CLient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export function uploadImageFromBuffer(fileBody: Buffer, fileName: string) {
  const params = {
    Bucket: env.AWS_S3_BUCKET,
    Region: env.AWS_REGION,
    Key: fileName,
    Body: fileBody,
    ContentType: 'image/jpeg',
  };

  return S3Client.send(new PutObjectCommand(params));
}
