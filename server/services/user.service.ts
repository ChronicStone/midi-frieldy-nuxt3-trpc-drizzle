import { off } from 'process';
import { and, eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { omit } from '@/utils/data/object';
import { usersTable, userCredentialsTable, userOrganizationsTable } from '@/db/schema';
import { db } from '@/db';
import { comparePassword } from '@/utils/server/bcrypt';
import { authLoginDto, authRegisterDto } from '@/server/dto/auth.dto';

export async function registerUser(payload: z.infer<typeof authRegisterDto>) {
  const credentialsExist = await db.query.userCredentialsTable.findFirst({
    where: (t) => and(eq(t.email, payload.email), eq(t.type, payload.type)),
  });

  if (credentialsExist) throw new TRPCError({ code: 'BAD_REQUEST', message: 'User already exists' });

  const [user] = await db
    .insert(usersTable)
    .values({
      firstName: payload.firstName,
      lastName: payload.lastName,
      avatar: payload.avatar,
    })
    .returning();

  const [credentials] = await db
    .insert(userCredentialsTable)
    .values({
      userIdRef: user._id,
      email: payload.email,
      type: payload.type,
      ...(payload.type === 'email' && { password: payload.password }),
      ...(payload.type !== 'email' && { userId: payload.userId }),
    })
    .returning();

  return {
    ...user,
    credentials,
    organizationAccess: [],
  };
}

export async function getUserFromCredentials(input: z.infer<typeof authLoginDto>) {
  const credentials = await db.query.userCredentialsTable.findFirst({
    where: (t) =>
      input.type === 'email'
        ? and(eq(t.type, input.type), eq(t.email, input.email), eq(t.password, input.password))
        : and(eq(t.type, input.type), eq(t.email, input.email), eq(t.userId, input.userId)),
    with: {
      user: {
        with: {
          organizationAccess: {
            with: { organization: true },
          },
        },
      },
    },
  });

  if (!credentials) return null;
  if (input.type === 'email' && !comparePassword(input.password, credentials.password!)) return null;

  return {
    ...credentials.user,
    credentials: omit(credentials, ['user']),
  };
}

export function addUserToOrganization(userId: string, organizationId: string, role: 'admin' | 'client') {
  return db
    .insert(userOrganizationsTable)
    .values({
      userId,
      organizationId,
      admin: role === 'admin',
    })
    .returning()
    .then((data) => data[0]);
}
