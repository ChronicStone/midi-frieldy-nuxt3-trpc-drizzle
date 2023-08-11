import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { authLinkDto, authRegisterDto } from './auth.dto';
import { invitationsTable } from '@/db/schema';

export const validateInvitationDto = z.object({
  invitationId: z.string(),
  emailHash: z
    .string()
    .optional()
    .transform((v) => (v ? decodeURIComponent(v) : undefined)),
});

export const acceptInvitationDto = validateInvitationDto.extend({
  account: z.object({
    mode: z.enum(['link', 'register']),
    linkPayload: authLinkDto.optional(),
    registerPayload: authRegisterDto.optional(),
  }),
});

export const createInvitationLinkDto = createInsertSchema(invitationsTable)
  .pick({
    expireAt: true,
    organizationId: true,
    targetApp: true,
    type: true,
    maxUsage: true,
  })
  .extend({
    type: z.literal('link'),
    targetApp: z.enum(['admin', 'client']),
  });

export const inviteUsersByEmailDto = createInvitationLinkDto.omit({ maxUsage: true }).extend({
  emails: z.array(z.string()),
  targetApp: z.enum(['admin', 'client']),
  type: z.literal('email'),
});
