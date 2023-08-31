import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { observable } from '@trpc/server/observable';
import { consola } from 'consola';
import { protectedProcedure, router } from '@/server/trpc/trpc';
import { userOrganizationsTable } from '@/db/schema';
import { omit } from '~/utils/data/object';
import { mapEvents } from '~/server/event';

export const userRouter = router({
  // TODO: RFC TO CORE QUERY
  getOrganizationUsers: protectedProcedure.meta({ auth: true, requireOrg: true }).query(async ({ ctx }) => {
    const organization = ctx.organization!;
    const users = await ctx.db.query.usersTable.findMany({
      with: {
        credentials: { columns: { email: true } },
        organizationAccess: true,
      },
    });
    return users
      .filter((user) => user.organizationAccess.some((org) => org.organizationId === organization._id))
      .map((user) => ({
        ...omit(user, ['organizationAccess']),
        isOnline: user.organizationAccess.find((u) => u.organizationId === organization._id)?.online ?? false,
      }));
  }),
  setUserOnlineStatus: protectedProcedure
    .meta({ auth: true, requireOrg: true })
    .input(z.object({ online: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userOrganizationsTable)
        .set({ online: input.online })
        .where(
          and(
            eq(userOrganizationsTable.userId, ctx.user!._id),
            eq(userOrganizationsTable.organizationId, ctx.organization!._id),
          ),
        );
      mapEvents.emit('userOnlineStatusChanged', {
        userId: ctx.user!._id,
        organizationId: ctx.organization!._id,
        online: input.online,
      });
    }),
  userOnlineStatusChanged: protectedProcedure
    .meta({ auth: false, requireOrg: false })
    .input(z.object({ organizationId: z.string(), userId: z.string() }))
    .subscription(({ input, ctx }) => {
      const storage = useStorage('db');
      storage.setItem(`ws:${ctx.wsClientId}`, input.userId);
      return observable<{ userId: string; online: boolean }>((emit) => {
        mapEvents.on(
          'userOnlineStatusChanged',
          (params) => params.organizationId === input.organizationId && emit.next(params),
        );
        return () => {
          mapEvents.off(
            'userOnlineStatusChanged',
            (params) => params.organizationId === input.organizationId && emit.next(params),
          );
        };
      });
    }),
});
