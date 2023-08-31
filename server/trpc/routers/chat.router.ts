import { inArray } from 'drizzle-orm';
import { protectedProcedure, router } from '@/server/trpc/trpc';

export const chatRouter = router({
  getUserRooms: protectedProcedure.meta({ auth: true }).query(async ({ ctx }) => {
    const user = ctx.user!;

    const userRoomEntries = await ctx.db.query.chatRoomUsersTable.findMany({
      where: (t, { eq }) => eq(t.userId, user._id),
      columns: { userId: true, chatRoomId: true },
    });

    const [{ messages, users }] = await ctx.db.query.chatRoomsTable.findMany({
      where: (t) =>
        inArray(
          t._id,
          userRoomEntries.map((e) => e.chatRoomId),
        ),
      with: {
        messages: {
          with: { user: { columns: { _id: true, firstName: true, lastName: true, avatar: true } } },
        },
        lunchGroup: { columns: { _id: true, label: true } },
        lunchGroupPoll: { columns: { _id: true, label: true } },
        users: {
          with: { user: { columns: { _id: true, firstName: true, lastName: true, avatar: true } } },
        },
      },
    });
  }),
});
