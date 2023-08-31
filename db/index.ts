import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzleLocal } from 'drizzle-orm/postgres-js';

import postgres from 'postgres';
import * as schema from './schema';
import { env } from '@/server/env';

neonConfig.fetchConnectionCache = true;

export const db =
  env.DATABASE_SOURCE === 'local'
    ? drizzleLocal(postgres(env.DATABASE_URL), { schema, logger: true })
    : drizzleNeon(neon(env.DATABASE_URL), { schema });
