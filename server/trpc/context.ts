/* eslint-disable import/default */
/* eslint-disable import/no-named-as-default-member */
import { TRPCError, inferAsyncReturnType } from '@trpc/server';
import { type H3Event, getHeader } from 'h3';
import { eq } from 'drizzle-orm';
import jwt from 'jsonwebtoken';
import { db } from '@/db';
import { env } from '@/server/env';
import { jwtSafeParse } from '@/utils/server/jwt';
import { userDto } from '@/server/dto/user.dto';

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (_event: H3Event) => {
  const authToken = (getHeader(_event, 'authorization') ?? '').split(' ')[1];
  // const organizationId = getHeader(_event, "organizationId");

  const valid = authToken ? jwt.verify(authToken, env.JWT_SECRET_KEY) : true;
  if (!valid) throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid jwt token' });

  const decoded = jwtSafeParse(authToken ?? '', userDto);
  const user = decoded
    ? await db.query.usersTable.findFirst({
        where: (user) => eq(user._id, decoded._id),
      })
    : null;

  return {
    db,
    user,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;
