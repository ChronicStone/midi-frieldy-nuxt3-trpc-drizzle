import { z } from 'zod';

export const rawRestaurantSchema = z.object({
  name: z.string(),
  placeId: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    country: z.string(),
    zip: z.string(),
  }),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  gMapsReviews: z.array(
    z.object({
      authorName: z.string(),
      authorPhoto: z.string(),
      rating: z.number(),
      text: z.string(),
      createdAt: z.string(),
    }),
  ),
  photos: z.array(
    z.object({
      reference: z.string(),
      width: z.number(),
      height: z.number(),
      url: z.string(),
    }),
  ),
  priceLevel: z.number(),
  openingHours: z.array(z.string()),
  website: z.string(),
  phoneNumber: z.string(),
  services: z.object({
    delivery: z.boolean(),
    takeout: z.boolean(),
    dineIn: z.boolean(),
    wine: z.boolean(),
    beer: z.boolean(),
    breakfast: z.boolean(),
    lunch: z.boolean(),
    dinner: z.boolean(),
    reservable: z.boolean(),
    vegetarian: z.boolean(),
  }),
  types: z.array(z.string()),
});
