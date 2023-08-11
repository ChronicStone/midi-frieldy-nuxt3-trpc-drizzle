import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  zip: z.string(),
  country: z.string(),
});

export const coordinatesSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
