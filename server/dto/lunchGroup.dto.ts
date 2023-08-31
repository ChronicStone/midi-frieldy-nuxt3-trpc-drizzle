import { z } from 'zod';
import { createInsertSchema } from 'drizzle-zod';
import { lunchGroupsTable, lunchGroupPollsTable } from '@/db/schema';

export const createLunchGroupDto = createInsertSchema(lunchGroupsTable).pick({
  label: true,
  description: true,
  meetingTime: true,
  userSlots: true,
  restaurantId: true,
});

export const createLunchGroupPollDto = createInsertSchema(lunchGroupPollsTable)
  .pick({
    label: true,
    description: true,
    meetingTime: true,
    userSlots: true,
    voteDeadline: true,
  })
  .extend({
    allowedRestaurants: z.array(z.string()).optional(),
    userVote: z.string(),
  });

export const updateLunchGroup = createLunchGroupDto.partial();

export const lunchGroupSubscriptionDto = z.object({
  authToken: z.string(),
  organizationId: z.string(),
});

export const accessLunchGroupDto = z.object({
  lunchGroupId: z.string(),
});

export const lunchGroupPollVoteDto = z.object({ pollId: z.string(), restaurantId: z.string() });
