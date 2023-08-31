import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { chatRoomsTable } from '~/db/schema';

export const createChatRoomDto = z.object({
    userId