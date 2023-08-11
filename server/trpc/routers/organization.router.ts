import { router, protectedProcedure } from '../trpc';

export const organizationRouter = router({
  getOrganizations: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.organizationsTable.findMany({
      with: {},
    });
  }),
});
