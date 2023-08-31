import { z } from 'zod';
import { eq, InferSelectModel } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { createLunchGroupDto, createLunchGroupPollDto } from '@/server/dto/lunchGroup.dto';
import { db } from '@/db';
import {
  lunchGroupPollsTable,
  lunchGroupsTable,
  lunchGroupUsersTable,
  lunchGroupPollsRestaurantsTable,
  lunchGroupPollEntriesTable,
  organizationsTable,
  usersTable,
} from '@/db/schema';

export async function createLunchGroup(
  groupDto: z.infer<typeof createLunchGroupDto>,
  user: InferSelectModel<typeof usersTable>,
  organization: InferSelectModel<typeof organizationsTable>,
  users?: InferSelectModel<typeof usersTable>[],
) {
  const restaurant = await db.query.restaurantsTable.findFirst({
    where: (t) => eq(t._id, groupDto.restaurantId),
  });
  if (!restaurant) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Restaurant not found' });

  const [group] = await db
    .insert(lunchGroupsTable)
    .values({
      label: groupDto.label,
      description: groupDto.description,
      meetingTime: groupDto.meetingTime,
      userSlots: groupDto.userSlots,
      restaurantId: groupDto.restaurantId,
      organizationId: organization._id,
      ownerId: user._id,
      status: 'open',
    })
    .returning();

  const [ownerEntry, ...userEntries] = await db
    .insert(lunchGroupUsersTable)
    .values([
      {
        lunchGroupId: group._id,
        userId: user._id,
      },
      ...(users?.map((user) => ({ lunchGroupId: group._id, userId: user._id })) ?? []),
    ])
    .returning();

  return {
    ...group,
    owner: user,
    users: [
      { ...ownerEntry, user },
      ...userEntries.map((entry) => ({ ...entry, user: users!.find((u) => u._id === entry.userId)! })),
    ],
    restaurant,
    organization,
  };
}

export async function createLunchGroupPoll(
  pollDto: z.infer<typeof createLunchGroupPollDto>,
  user: InferSelectModel<typeof usersTable>,
  organization: InferSelectModel<typeof organizationsTable>,
) {
  const [poll] = await db
    .insert(lunchGroupPollsTable)
    .values({
      label: pollDto.label,
      description: pollDto.description,
      meetingTime: pollDto.meetingTime,
      voteDeadline: pollDto.voteDeadline,
      organizationId: organization._id,
      ownerId: user._id,
      status: 'open',
    })
    .returning();

  await db
    .insert(lunchGroupPollsRestaurantsTable)
    .values(
      pollDto.allowedRestaurants?.map((restaurantId) => ({
        lunchGroupPollId: poll._id,
        restaurantId,
      })) ?? [],
    )
    .returning();

  await db.insert(lunchGroupPollEntriesTable).values({
    lunchGroupPollId: poll._id,
    userId: user._id,
    restaurantId: pollDto.userVote,
  });

  const pollEntries = await db.query.lunchGroupPollEntriesTable.findMany({
    where: (t) => eq(t.lunchGroupPollId, poll._id),
    with: {
      restaurant: { columns: { _id: true, name: true } },
      user: { columns: { _id: true, firstName: true, lastName: true } },
    },
  });

  const restaurants = await db.query.lunchGroupPollsRestaurantsTable.findMany({
    where: (t) => eq(t.lunchGroupPollId, poll._id),
    with: { restaurant: { columns: { _id: true, name: true } } },
  });

  return {
    ...poll,
    owner: user,
    organization,
    restaurants,
    pollEntries,
    lunchGroup: null,
  };
}
