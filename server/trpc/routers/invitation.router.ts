import { eq, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { publicProcedure, protectedProcedure, router } from '@/server/trpc/trpc';
import {
  acceptInvitationDto,
  createInvitationLinkDto,
  validateInvitationDto,
} from '@/server/dto/invitation.dto';
import { comparePassword } from '@/utils/server/bcrypt';
import { getUserFromCredentials, registerUser, addUserToOrganization } from '@/server/services/user.service';
import {
  addInvitationUsageEntry,
  createInvitation,
  getInvitationData,
} from '@/server/services/invitation.service';
import { env } from '@/server/env';

export const invitationRouter = router({
  createInvitationLink: protectedProcedure.input(createInvitationLinkDto).mutation(async ({ input, ctx }) => {
    const invitation = await createInvitation(input);
    return `${env.CLIENT_APP_URL}/auth/invitation/${invitation._id}`;
  }),
  validateInvitation: publicProcedure.input(validateInvitationDto).query(async ({ input, ctx }) => {
    const invitation = await getInvitationData(input);

    if (!invitation)
      return {
        success: false as const,
        notFound: true,
        maxUsageReached: false,
        alreadyUsed: false,
        expired: false,
      };

    const maxUsageReached = (invitation.usages?.length ?? 0) >= (invitation?.maxUsage ?? 0);
    const expired = new Date(invitation.expireAt) < new Date();
    const alreadyUsed = !input.emailHash
      ? false
      : invitation.usages.some((item) => comparePassword(item.email ?? '', input.emailHash ?? ''));

    if (maxUsageReached || alreadyUsed || expired)
      return {
        success: false as const,
        notFound: false,
        maxUsageReached,
        alreadyUsed,
        expired,
      };

    return {
      success: true as const,
      notFound: false,
      maxUsageReached,
      alreadyUsed,
      expired,
      invitation: {
        _id: invitation._id,
        type: invitation.type,
        organization: invitation.organization,
      },
    };
  }),
  acceptInvitationDto: publicProcedure.input(acceptInvitationDto).mutation(async ({ input, ctx }) => {
    const invitation = await getInvitationData(input);
    if (!invitation)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Invitation not found',
      });

    const unhashedEmail = !input.emailHash
      ? null
      : invitation.emails?.find?.((email) => comparePassword(email, input.emailHash!)) ?? '';
    const maxUsageReached = (invitation.usages?.length ?? 0) >= (invitation.maxUsage ?? 0);
    const expired = new Date(invitation.expireAt) < new Date();
    const alreadyUsed = !input.emailHash
      ? false
      : invitation.usages.some((item) => comparePassword(item.email ?? '', input.emailHash ?? ''));

    if (maxUsageReached || alreadyUsed || expired)
      return {
        success: false as const,
        notFound: false,
        maxUsageReached,
        alreadyUsed,
        expired,
      };

    const user =
      input.account.mode === 'register'
        ? await registerUser(input.account.registerPayload!)
        : await getUserFromCredentials(input.account.linkPayload!);

    if (!user) throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
    if (user.organizationAccess.some((access) => access.organizationId === invitation.organization._id))
      throw new TRPCError({ code: 'BAD_REQUEST', message: 'User already in organization' });

    await addUserToOrganization(user._id, invitation.organization._id, invitation.targetApp);
    await addInvitationUsageEntry(invitation._id, user._id, unhashedEmail);

    return {
      success: true as const,
      notFound: false,
      maxUsageReached,
      alreadyUsed,
      expired,
    };
  }),
  getInvitations: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.invitationsTable.findMany({
      with: {
        organization: { columns: { _id: true, name: true } },
        usages: {
          with: {
            linkedAccount: {
              columns: { _id: true, firstName: true, lastName: true },
              with: {
                credentials: { columns: { _id: true, email: true } },
              },
            },
          },
        },
      },
      extras: {
        isExpired: sql<boolean>`"expireAt" < NOW()`.as('isExpired'),
      },
    });
  }),
});
