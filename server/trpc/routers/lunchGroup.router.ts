import { protectedProcedure, router } from '@/server/trpc/trpc';

export const lunchGroupRouter = router({
  getLunchGroups: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.lunchGroupsTable.findMany({
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
  getLunchGroupPolls: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.lunchGroupPollsTable.findMany({
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
});
