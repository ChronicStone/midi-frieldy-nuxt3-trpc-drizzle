import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { comparePassword } from '@/utils/server/bcrypt';
import { invitationUsagesTable, invitationsTable } from '@/db/schema';
import {
  createInvitationLinkDto,
  inviteUsersByEmailDto,
  validateInvitationDto,
} from '@/server/dto/invitation.dto';
import { db } from '@/db';

export async function getInvitationData(input: z.infer<typeof validateInvitationDto>) {
  const invitation = await db.query.invitationsTable.findFirst({
    where: (t) => eq(t._id, input.invitationId),
    with: {
      organization: true,
      usages: true,
    },
  });

  if (
    !invitation ||
    (invitation.type === 'email' &&
      (!input.emailHash || !invitation.emails?.some((email) => comparePassword(email, input.emailHash!))))
  )
    return null;

  return invitation;
}

export function addInvitationUsageEntry(invitationId: string, userId: string, email?: string | null) {
  return db
    .insert(invitationUsagesTable)
    .values({
      invitationId,
      linkedAccountId: userId,
      email: email || null,
    })
    .returning()
    .then(([result]) => result);
}

export async function createInvitation(
  input: z.infer<typeof createInvitationLinkDto> | z.infer<typeof inviteUsersByEmailDto>,
) {
  const invitation = await db
    .insert(invitationsTable)
    .values({
      type: input.type,
      organizationId: input.organizationId,
      expireAt: new Date().toISOString(),
      targetApp: input.targetApp,
      ...(input.type === 'link' && { maxUsage: input.maxUsage }),
      ...(input.type === 'email' && { emails: input.emails }),
    })
    .returning()
    .then(([result]) => result);

  const organization = await db.query.organizationsTable.findFirst({
    where: (t) => eq(t._id, input.organizationId),
  });

  return {
    ...invitation,
    organization,
  };
}
