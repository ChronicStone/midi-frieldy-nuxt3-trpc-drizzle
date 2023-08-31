import { z } from 'zod';
import { and, eq, gte, lte } from 'drizzle-orm';
import { observable } from '@trpc/server/observable';
import { TRPCError } from '@trpc/server';
import { createLunchGroup, createLunchGroupPoll } from '@/server/services/lunchGroup.service';
import { mapEvents } from '@/server/event';
import { protectedProcedure, router } from '@/server/trpc/trpc';
import {
  accessLunchGroupDto,
  createLunchGroupDto,
  createLunchGroupPollDto,
  lunchGroupPollVoteDto,
  lunchGroupSubscriptionDto,
} from '@/server/dto/lunchGroup.dto';
import { lunchGroupPollEntriesTable, lunchGroupUsersTable, lunchGroupsTable } from '~/db/schema';

export const lunchGroupRouter = router({
  getLunchGroups: protectedProcedure
    .input(z.object({ currentDayScope: z.boolean() }).optional())
    .query(({ ctx, input }) =>
      ctx.db.query.lunchGroupsTable.findMany({
        where: (t) =>
          and(
            ...[ctx.organization ? eq(t.organizationId, ctx.organization._id) : undefined],
            ...[
              input?.currentDayScope
                ? and(
                    gte(t.createdAt, new Date(new Date().setHours(0, 0, 0)).toISOString()),
                    lte(t.createdAt, new Date(new Date().setHours(23, 59, 59)).toISOString()),
                  )
                : undefined,
            ],
          ),
        with: {
          organization: { columns: { _id: true, name: true } },
          owner: { columns: { _id: true, firstName: true, lastName: true } },
          restaurant: { columns: { _id: true, name: true } },
          users: {
            with: { user: { columns: { _id: true, firstName: true, lastName: true } } },
          },
        },
      }),
    ),
  getLunchGroupPolls: protectedProcedure
    .input(z.object({ currentDayScope: z.boolean() }).optional())
    .query(({ ctx, input }) =>
      ctx.db.query.lunchGroupPollsTable.findMany({
        where: (t) =>
          and(
            ...[ctx.organization ? eq(t.organizationId, ctx.organization._id) : undefined],
            ...[input?.currentDayScope ? eq(t.status, 'open') : undefined],
          ),
        with: {
          lunchGroup: { columns: { _id: true } },
          organization: { columns: { _id: true, name: true } },
          owner: { columns: { _id: true, firstName: true, lastName: true } },
          restaurants: {
            with: { restaurant: { columns: { _id: true, name: true } } },
          },
          pollEntries: {
            with: {
              restaurant: { columns: { _id: true, name: true } },
              user: { columns: { _id: true, firstName: true, lastName: true } },
            },
          },
        },
      }),
    ),
  createGroup: protectedProcedure
    .meta({ auth: true, requireOrg: true })
    .input(createLunchGroupDto)
    .mutation(async ({ ctx, input }) => {
      const lunchGroup = await createLunchGroup(input, ctx.user!, ctx.organization!);
      mapEvents.emit('groupCreated', lunchGroup);
      return lunchGroup;
    }),
  groupCreated: protectedProcedure
    .meta({ auth: false, requireOrg: false })
    .input(lunchGroupSubscriptionDto)
    .subscription(({ input }) => {
      return observable<Awaited<ReturnType<typeof createLunchGroup>>>((emit) => {
        mapEvents.on(
          'groupCreated',
          (group) => group.organizationId === input.organizationId && emit.next(group),
        );
        return () => {
          mapEvents.off(
            'groupCreated',
            (group) => group.organizationId === input.organizationId && emit.next(group),
          );
        };
      });
    }),
  joinGroup: protectedProcedure
    .meta({ auth: true, requireOrg: true })
    .input(accessLunchGroupDto)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user!;
      const organization = ctx.organization!;
      const lunchGroup = await ctx.db.query.lunchGroupsTable.findFirst({
        where: (t, { eq, and }) => and(eq(t._id, input.lunchGroupId), eq(t.organizationId, organization._id)),
      });

      if (!lunchGroup) throw new TRPCError({ code: 'NOT_FOUND', message: 'Lunch group not found' });
      const [userEntry] = await ctx.db
        .insert(lunchGroupUsersTable)
        .values({
          userId: user._id,
          lunchGroupId: lunchGroup._id,
        })
        .returning();

      mapEvents.emit('userJoinedGroup', {
        userId: user._id,
        userEntryId: userEntry._id,
        organizationId: organization._id,
        groupId: lunchGroup._id,
      });

      return userEntry;
    }),
  userJoinedGroup: protectedProcedure
    .meta({ auth: false, requireOrg: false })
    .input(lunchGroupSubscriptionDto)
    .subscription(({ input }) => {
      return observable<{ userId: string; userEntryId: string; groupId: string }>((emit) => {
        mapEvents.on(
          'userJoinedGroup',
          (params) => params.organizationId === input.organizationId && emit.next(params),
        );
        return () => {
          mapEvents.off(
            'userJoinedGroup',
            (params) => params.organizationId === input.organizationId && emit.next(params),
          );
        };
      });
    }),
  leaveGroup: protectedProcedure
    .meta({ auth: true, requireOrg: true })
    .input(accessLunchGroupDto)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user!;
      const organization = ctx.organization!;
      await ctx.db
        .delete(lunchGroupUsersTable)
        .where(
          and(
            eq(lunchGroupUsersTable.userId, user._id),
            eq(lunchGroupUsersTable.lunchGroupId, input.lunchGroupId),
          ),
        );
      mapEvents.emit('userLeftGroup', {
        userId: user._id,
        organizationId: organization._id,
        groupId: input.lunchGroupId,
      });

      return true;
    }),
  userLeftGroup: protectedProcedure
    .meta({ auth: false, requireOrg: false })
    .input(lunchGroupSubscriptionDto)
    .subscription(({ input }) => {
      return observable<{ userId: string; groupId: string }>((emit) => {
        mapEvents.on(
          'userLeftGroup',
          (params) => params.organizationId === input.organizationId && emit.next(params),
        );
        return () => {
          mapEvents.off(
            'userLeftGroup',
            (params) => params.organizationId === input.organizationId && emit.next(params),
          );
        };
      });
    }),
  deleteGroup: protectedProcedure
    .meta({ auth: true, requireOrg: true })
    .input(accessLunchGroupDto)
    .mutation(async ({ ctx, input }) => {
      const organization = ctx.organization!;
      const user = ctx.user!;

      const lunchGroup = await ctx.db.query.lunchGroupsTable.findFirst({
        where: (t, { eq, and }) => and(eq(t._id, input.lunchGroupId), eq(t.organizationId, organization._id)),
      });

      if (!lunchGroup) throw new TRPCError({ code: 'NOT_FOUND', message: 'Lunch group not found' });
      if (lunchGroup.ownerId !== user._id)
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Only owner can delete group' });

      await ctx.db.delete(lunchGroupUsersTable).where(eq(lunchGroupUsersTable.lunchGroupId, lunchGroup._id));
      await ctx.db.delete(lunchGroupsTable).where(eq(lunchGroupsTable._id, lunchGroup._id));
      mapEvents.emit('groupDeleted', {
        organizationId: organization._id,
        groupId: lunchGroup._id,
      });
    }),
  groupDeleted: protectedProcedure
    .meta({ auth: false, requireOrg: false })
    .input(lunchGroupSubscriptionDto)
    .subscription(({ input }) => {
      return observable<{ groupId: string }>((emit) => {
        mapEvents.on(
          'groupDeleted',
          (params) => params.organizationId === input.organizationId && emit.next(params),
        );
        return () => {
          mapEvents.off(
            'groupDeleted',
            (params) => params.organizationId === input.organizationId && emit.next(params),
          );
        };
      });
    }),
  createLunchGroupPoll: protectedProcedure
    .meta({ auth: true, requireOrg: true })
    .input(createLunchGroupPollDto)
    .mutation(async ({ ctx, input }) => {
      const groupPoll = await createLunchGroupPoll(input, ctx.user!, ctx.organization!);
      mapEvents.emit('groupPollCreated', groupPoll);
      return groupPoll;
    }),
  groupPollCreated: protectedProcedure
    .meta({ auth: false, requireOrg: false })
    .input(lunchGroupSubscriptionDto)
    .subscription(({ input }) => {
      return observable<Awaited<ReturnType<typeof createLunchGroupPoll>>>((emit) => {
        mapEvents.on(
          'groupPollCreated',
          (groupPoll) => groupPoll.organizationId === input.organizationId && emit.next(groupPoll),
        );
        return () => {
          mapEvents.off(
            'groupPollCreated',
            (groupPoll) => groupPoll.organizationId === input.organizationId && emit.next(groupPoll),
          );
        };
      });
    }),
  setGroupPollUserVote: protectedProcedure
    .meta({ auth: true, requireOrg: true })
    .input(lunchGroupPollVoteDto)
    .mutation(async ({ ctx, input }) => {
      const user = ctx.user!;
      const organization = ctx.organization!;
      const existingEntry = await ctx.db.query.lunchGroupPollEntriesTable.findFirst({
        where: (t, { eq, and }) => and(eq(t.lunchGroupPollId, input.pollId), eq(t.userId, user._id)),
      });

      if (existingEntry) {
        await ctx.db
          .update(lunchGroupPollEntriesTable)
          .set({ restaurantId: input.restaurantId, updatedAt: new Date().toISOString() })
          .where(eq(lunchGroupPollEntriesTable._id, existingEntry._id));
        mapEvents.emit('userVotedToPoll', {
          userId: user._id,
          organizationId: organization._id,
          pollId: input.pollId,
          restaurantId: input.restaurantId,
          entryId: existingEntry._id,
        });
      } else {
        const [entry] = await ctx.db
          .insert(lunchGroupPollEntriesTable)
          .values({
            userId: user._id,
            restaurantId: input.restaurantId,
            lunchGroupPollId: input.pollId,
          })
          .returning();

        mapEvents.emit('userVotedToPoll', {
          userId: user._id,
          organizationId: organization._id,
          pollId: input.pollId,
          restaurantId: input.restaurantId,
          entryId: entry._id,
        });
      }
    }),
  userVotedToPoll: protectedProcedure
    .meta({ auth: false, requireOrg: false })
    .input(lunchGroupSubscriptionDto)
    .subscription(({ input }) => {
      return observable<{
        userId: string;
        pollId: string;
        restaurantId: string;
        entryId: string;
      }>((emit) => {
        mapEvents.on(
          'userVotedToPoll',
          (params) => params.organizationId === input.organizationId && emit.next(params),
        );
        return () => {
          mapEvents.off(
            'userVotedToPoll',
            (params) => params.organizationId === input.organizationId && emit.next(params),
          );
        };
      });
    }),
  groupPollEnded: protectedProcedure
    .meta({ auth: false, requireOrg: false })
    .input(lunchGroupSubscriptionDto)
    .subscription(({ input }) => {
      return observable<{ pollId: string }>((emit) => {
        mapEvents.on(
          'groupPollEnded',
          (params) => params.organizationId === input.organizationId && emit.next(params),
        );
        return () => {
          mapEvents.off(
            'groupPollEnded',
            (params) => params.organizationId === input.organizationId && emit.next(params),
          );
        };
      });
    }),
});
