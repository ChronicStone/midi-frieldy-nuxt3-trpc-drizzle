import { z } from 'zod';
import { restaurantReviewsTable, restaurantsTable } from '../../db/schema';
import { rawRestaurantSchema } from '@/server/dto/restaurant.dto';
import { db } from '@/db';

export async function createOrganizationRestaurants(
  organizationId: string,
  rawRestaurants: z.infer<typeof rawRestaurantSchema>[],
) {
  const restaurants = await db
    .insert(restaurantsTable)
    .values(
      rawRestaurants.map((rawRestaurant) => ({
        name: rawRestaurant.name,
        placeId: rawRestaurant.placeId,
        organizationId,
        coordinates: rawRestaurant.coordinates,
        address: rawRestaurant.address,
        photos: rawRestaurant.photos,
        priceLevel: rawRestaurant.priceLevel,
        openingHours: rawRestaurant.openingHours,
        website: rawRestaurant.website,
        phoneNumber: rawRestaurant.phoneNumber,
        services: rawRestaurant.services,
        types: rawRestaurant.types,
      })),
    )
    .returning();

  const reviews = await db
    .insert(restaurantReviewsTable)
    .values(
      restaurants.map((restaurant) => ({
        restaurantId: restaurant._id,
        google: rawRestaurants.find((rawRestaurant) => rawRestaurant.placeId === restaurant.placeId)!
          .gMapsReviews,
      })),
    )
    .returning();

  return restaurants.map((restaurant) => ({
    ...restaurant,
    reviews: reviews.find((review) => review.restaurantId === restaurant._id),
  }));
}
