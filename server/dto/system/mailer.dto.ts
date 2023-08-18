import { z } from 'zod';

export const emailTemplateKeySchema = z.enum(['userInvitation', 'organizationCreation']);

export const userInvitationEmailPayloadSchema = z.object({
  type: z.literal(emailTemplateKeySchema.enum.userInvitation),
  params: z.object({
    email: z.string().email(),
    invitationLink: z.string(),
    expireAt: z.string(),
    organization: z.string().nullish(),
  }),
});

export const organizationCreationEmailPayloadSchema = z.object({
  type: z.literal(emailTemplateKeySchema.enum.organizationCreation),
  params: z.object({}),
});

export const emailTemplatePayloadSchema = z.union([
  userInvitationEmailPayloadSchema,
  organizationCreationEmailPayloadSchema,
]);
