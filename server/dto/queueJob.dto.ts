import { z } from 'zod';

export const invitationEmailJobParamsSchema = z.object({
  operation: z.literal('sendInvitationEmail'),
  params: z.object({
    invitationId: z.string(),
  }),
});

export const restaurantResolverJobParamsSchema = z.object({
  operation: z.literal('resolveRestaurant'),
  params: z.object({
    organizationId: z.string(),
  }),
});

export const queueJobParamsSchema = z.union([
  invitationEmailJobParamsSchema,
  restaurantResolverJobParamsSchema,
]);

export const queueJobResultSchema = z.union([
  z.object({
    success: z.literal(true),
  }),
  z.object({
    success: z.literal(false),
    message: z.string(),
  }),
]);
