import { z } from 'zod';
import { addressSchema, coordinatesSchema } from '@/server/dto/system/location.dto';

export type Address = z.infer<typeof addressSchema>;
export type Coordinates = z.infer<typeof coordinatesSchema>;
