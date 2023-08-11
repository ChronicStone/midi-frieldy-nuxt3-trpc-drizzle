import { customType } from 'drizzle-orm/pg-core';
import { hashPassword } from '../utils/server/bcrypt';

export const nullablePassword = customType<{
  data: string | null;
  notNull: false;
}>({
  dataType() {
    return 'varchar(255)';
  },
  toDriver: (value) => (value ? hashPassword(value) : null),
});
