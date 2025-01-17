import { TRPCError } from '@trpc/server';
import { getCoordinatesFromAddress } from '@/server/services/external/googleMaps.service';
import { router, protectedProcedure } from '@/server/trpc/trpc';
import { createOrganizationDto } from '@/server/dto/organization.dto';
import { organizationsTable } from '@/db/schema';
import { resolveOrganizationRestaurants } from '@/server/defer/queue/maps.queue';

export const organizationRouter = router({
  getOrganizations: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.organizationsTable.findMany({
      orderBy: (t) => t.createdAt,
      with: {},
    });
  }),
  createOrganization: protectedProcedure.input(createOrganizationDto).mutation(async ({ ctx, input }) => {
    const coordinates = await getCoordinatesFromAddress(input.address);

    if (!coordinates)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Could not find coordinates for address' });

    const [organization] = await ctx.db
      .insert(organizationsTable)
      .values({
        name: input.name,
        address: input.address,
        coordinates,
      })
      .returning();

    await resolveOrganizationRestaurants(organization._id);
    return organization;
  }),
});
