import { createEnv } from '@t3-oss/env-nuxt';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    JWT_SECRET_KEY: z.string(),
    JWT_EXPIRATION_TIME: z.union([z.string(), z.number()]),
    CLIENT_APP_URL: z.string().url(),
  },
});
