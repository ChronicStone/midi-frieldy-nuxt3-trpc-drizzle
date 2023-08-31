import { InferModel } from 'drizzle-orm';
import { RouterOutput } from '@/server/trpc/router';

export type User = InferModel<typeof usersTable>;
export type UserCredentials = InferModel<typeof userCredentialsTable>;
export type GatewayUser = RouterOutput['user']['getOrganizationUsers'];
