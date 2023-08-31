import { InferSelectModel } from 'drizzle-orm';
import { chatRoomUsersTable, chatRoomsTable, usersTable } from '@/db/schema';
import { db } from '~/db';

export async function createChatRoom(owner: InferSelectModel<typeof usersTable>) {
  const [chatRoom] = await db.insert(chatRoomsTable).values({}).returning();
  const [usersRecord] = await db
    .insert(chatRoomUsersTable)
    .values({
      chatRoomId: chatRoom._id,
      userId: owner._id,
    })
    .returning();

  return chatRoom;
}
