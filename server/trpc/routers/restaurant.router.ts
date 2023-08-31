import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from '@/server/trpc/trpc';
import { restaurantsTable } from '@/db/schema';

export const restaurantRouter = router({
  getRestaurants: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.restaurantsTable.findMany({
      ...(!!ctx.organization && {
        where: (t, { eq }) => eq(t.organizationId, ctx.organization!._id),
      }),
      orderBy: (t) => t.createdAt,
      with: {
        organization: {
          columns: { _id: true, name: true },
        },
      },
    }),
  ),
  toggleRestaurant: protectedProcedure.input(z.string()).mutation(async ({ input, ctx }) => {
    const restaurant = await ctx.db.query.restaurantsTable.findFirst({ where: (t) => eq(t._id, input) });
    if (!restaurant) throw new TRPCError({ code: 'NOT_FOUND', message: 'Restaurant not found' });
    return ctx.db
      .update(restaurantsTable)
      .set({ disabled: !restaurant.disabled })
      .where(eq(restaurantsTable._id, input));
  }),
});
