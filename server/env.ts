import { createEnv } from '@t3-oss/env-nuxt';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    DATABASE_SOURCE: z.enum(['neon', 'local']),
    JWT_SECRET_KEY: z.string(),
    JWT_EXPIRATION_TIME: z.union([z.string(), z.number()]),
    CLIENT_APP_URL: z.string().url(),
    VITE_GOOGLE_API_KEY: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_SES_SOURCE_EMAIL: z.string(),
    AWS_SES_REGION: z.string(),
    AWS_REGION: z.string(),
    AWS_S3_BUCKET: z.string(),
    AWS_S3_URL: z.string(),
    UPSTASH_REDIS_REST_URL: z.string().url(),
    UPSTASH_REDIS_REST_TOKEN: z.string(),
    // UPSTASH_REDIS_CONNECTION_URL: z.string().url(),
  },
});
