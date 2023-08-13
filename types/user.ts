import { InferModel } from 'drizzle-orm';

export type User = InferModel<typeof usersTable>;
export type UserCredentials = InferModel<typeof userCredentialsTable>;
