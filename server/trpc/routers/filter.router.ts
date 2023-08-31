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
  getRestaurants: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.restaurantsTable
      .findMany({
        ...(!!ctx.organization && {
          where: (t, { eq }) => eq(t.organizationId, ctx.organization!._id),
        }),
        columns: { _id: true, name: true, organizationId: true },
      })
      .then((restaurants) => {
        return restaurants.map((restaurant) => ({
          label: restaurant.name,
          value: restaurant._id,
        }));
      });
  }),
});
