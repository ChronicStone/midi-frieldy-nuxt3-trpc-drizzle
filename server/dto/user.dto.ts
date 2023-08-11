import { createSelectSchema } from 'drizzle-zod';
import { authLinkDto } from './auth.dto';
import { usersTable } from '@/db/schema';

export const userDto = createSelectSchema(usersTable);

export const registerAccountDto = authLinkDto;
