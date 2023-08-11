import { router, publicProcedure } from '../trpc';

export const filteOptionsRouter = router({
  getOrganizations: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.organizationsTable
      .findMany({
        columns: { _id: true, name: true },
      })
      .then((organizations) =>
        organizations.map((organization) => ({
          label: organization.name,
          value: organization._id,
        })),
      );
  }),
});
