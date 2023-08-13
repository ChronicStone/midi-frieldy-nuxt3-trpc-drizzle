import { eq, and } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
// eslint-disable-next-line import/default
import jwt from 'jsonwebtoken';
import { publicProcedure, router } from '@/server/trpc/trpc';
import { authLoginDto } from '@/server/dto/auth.dto';
import { env } from '@/server/env';
import { omit } from '@/utils/data/object';
import { getUserFromCredentials } from '@/server/services/user.service';

export const authRouter = router({
  login: publicProcedure.input(authLoginDto).mutation(async ({ input, ctx }) => {
    const user = await getUserFromCredentials(input);
    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });

    // eslint-disable-next-line import/no-named-as-default-member
    const accessToken = jwt.sign(
      {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.credentials.email,
      },
      env.JWT_SECRET_KEY,
      { expiresIn: env.JWT_EXPIRATION_TIME },
    );

    return {
      accessToken,
      user: omit(user, ['organizationAccess', 'credentials']),
      organizations: user.organizationAccess.map((oa) => oa.organization),
    };
  }),
});
