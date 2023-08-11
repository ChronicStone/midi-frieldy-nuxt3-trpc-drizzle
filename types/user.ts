import { InferModel } from 'drizzle-orm';
import { usersTable } from '@/db/schema';

export type User = InferModel<typeof usersTable>;
