import { z } from 'zod';

export const createOrganizationDto = z.object({
  name: z.string(),
  address: z.object({
    street: z.string(),
    city: z.string(),
    zip: z.string(),
    country: z.string(),
  }),
});
