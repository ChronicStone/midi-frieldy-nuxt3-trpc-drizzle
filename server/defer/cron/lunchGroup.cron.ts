import { lte, inArray } from 'drizzle-orm';
import { consola } from 'consola';
import { db } from '@/db';
import { lunchGroupPollsTable } from '@/db/schema';
import { scheduleTask } from '@/server/scheduler';
import { mapEvents } from '@/server/event';
import { createLunchGroup } from '~/server/services/lunchGroup.service';

export const lunchGroupCron = scheduleTask(async () => {
  try {
    consola.info('LunchGroupCron - Start run');
    const polls = await db.query.lunchGroupPollsTable.findMany({
      where: (t, { and, eq }) => and(lte(t.createdAt, new Date().toISOString()), eq(t.status, 'open')),
      with: { organization: true, owner: true, pollEntries: { with: { user: true } } },
    });

    consola.info(`LunchGroupCron - Closing ${polls.length} polls`);
    if (!polls.length) {
      consola.info(`LuncGroupCron - No polls to close`);
      return;
    }

    await db
      .update(lunchGroupPollsTable)
      .set({ status: 'closed' })
      .where(
        inArray(
          lunchGroupPollsTable._id,
          polls.map((poll) => poll._id),
        ),
      );

    for (const poll of polls)
      mapEvents.emit('groupPollEnded', { organizationId: poll.organizationId, pollId: poll._id });

    for (const poll of polls) {
      const votedRestaurantId = Object.entries(
        poll.pollEntries.reduce(
          (prev, curr) => ({ ...prev, [curr.restaurantId]: (prev?.[curr.restaurantId] ?? 0) + 1 }),
          {} as Record<string, number>,
        ),
      ).reduce((prev, curr) => (prev[1] > curr[1] ? prev : curr))[0];

      consola.log(
        `LunchGroupCron - Creating group for poll ${poll._id} with restaurant ${votedRestaurantId}`,
      );

      const group = await createLunchGroup(
        {
          label: poll.label,
          description: poll.description,
          restaurantId: votedRestaurantId,
          meetingTime: poll.meetingTime,
        },
        poll.owner,
        poll.organization,
        poll.pollEntries.map((entry) => entry.user).filter((user) => user._id !== poll.owner._id),
      );

      mapEvents.emit('groupCreated', group);
      consola.info(`LunchGroupCron - Created group ${group._id}`);
    }
    consola.info(`LunchGroupCron - Run completed`);
  } catch (err) {
    consola.error(err);
  }
  // TODO: FINALIZE IMPLEMENTATION
}, '1 * * * * *');
