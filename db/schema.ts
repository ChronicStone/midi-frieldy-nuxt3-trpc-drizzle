import { pgTable, uuid, varchar, boolean, json, timestamp, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { z } from 'zod';
import { nullablePassword } from './utils';
import { Address, Coordinates } from '@/types/system/location';
import { queueJobParamsSchema, queueJobResultSchema } from '@/server/dto/queueJob.dto';

export const usersTable = pgTable('users', {
  _id: uuid('id').defaultRandom().primaryKey(),
  onboarded: boolean('onboarded').default(false).notNull(),
  firstName: varchar('firstName').notNull(),
  lastName: varchar('lastName').notNull(),
  avatar: varchar('avatar'),
  admin: boolean('admin').default(false).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const usersTableRelations = relations(usersTable, ({ many, one }) => ({
  organizationAccess: many(userOrganizationsTable),
  credentials: one(userCredentialsTable, {
    fields: [usersTable._id],
    references: [userCredentialsTable.userIdRef],
  }),
}));

export const userCredentialsTable = pgTable('user_credentials', {
  _id: uuid('id').defaultRandom().primaryKey(),
  userIdRef: uuid('userIdRef')
    .notNull()
    .references(() => usersTable._id),
  type: varchar('type', { length: 20 }).notNull().$type<'email' | 'google' | 'linkedin' | 'facebook'>(),
  email: varchar('email').notNull(),
  password: nullablePassword('password'),
  userId: varchar('userId'),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const userCredentialsTableRelations = relations(userCredentialsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userCredentialsTable.userIdRef],
    references: [usersTable._id],
  }),
}));

export const organizationsTable = pgTable('organizations', {
  _id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name').notNull(),
  address: json('address').$type<Address>().notNull(),
  coordinates: json('coordinates').$type<Coordinates>().notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const organizationsTableRelations = relations(organizationsTable, ({ many }) => ({
  organizationUsers: many(userOrganizationsTable),
  restaurants: many(restaurantsTable),
}));

export const userOrganizationsTable = pgTable('user_organizations', {
  _id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('userId')
    .notNull()
    .references(() => usersTable._id),
  organizationId: uuid('organizationId')
    .notNull()
    .references(() => organizationsTable._id),
  admin: boolean('admin').default(false).notNull(),
  online: boolean('online').default(false).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const userOrganizationsTableRelations = relations(userOrganizationsTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [userOrganizationsTable.organizationId],
    references: [organizationsTable._id],
  }),
  user: one(usersTable, {
    fields: [userOrganizationsTable.userId],
    references: [usersTable._id],
  }),
}));

export const invitationsTable = pgTable('invitations', {
  _id: uuid('id').primaryKey().defaultRandom(),
  type: varchar('type', { length: 20 }).notNull().$type<'link' | 'email'>(),
  targetApp: varchar('targetApp', { length: 20 }).notNull().$type<'client' | 'admin'>(),
  organizationId: uuid('organizationId')
    .notNull()
    .references(() => organizationsTable._id),
  expireAt: timestamp('expireAt', { mode: 'string' }).notNull(),
  maxUsage: integer('maxUsage'),
  emails: json('emails').$type<string[]>().notNull().default([]),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const invitationsTableRelations = relations(invitationsTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [invitationsTable.organizationId],
    references: [organizationsTable._id],
  }),
  usages: many(invitationUsagesTable),
}));

export const invitationUsagesTable = pgTable('invitation_usages', {
  _id: uuid('id').primaryKey().defaultRandom(),
  invitationId: uuid('invitationId')
    .notNull()
    .references(() => invitationsTable._id),
  email: varchar('email'),
  usageDate: timestamp('usageDate', { mode: 'string' }).notNull().defaultNow(),
  linkedAccountId: uuid('linkedAccountId').references(() => usersTable._id),
});

export const invitationUsagesTableRelations = relations(invitationUsagesTable, ({ one }) => ({
  invitation: one(invitationsTable, {
    fields: [invitationUsagesTable.invitationId],
    references: [invitationsTable._id],
  }),
  linkedAccount: one(usersTable, {
    fields: [invitationUsagesTable.linkedAccountId],
    references: [usersTable._id],
  }),
}));

export const restaurantsTable = pgTable('restaurants', {
  _id: uuid('id').primaryKey().defaultRandom(),
  placeId: varchar('placeId').notNull(),
  name: varchar('name').notNull(),
  organizationId: uuid('organizationId')
    .notNull()
    .references(() => organizationsTable._id),
  address: json('address').$type<Address>().notNull(),
  coordinates: json('coordinates').$type<Coordinates>().notNull(),
  priceLevel: integer('priceLevel'),
  openingHours: json('openingHours').$type<string[]>(),
  website: varchar('website'),
  phoneNumber: varchar('phoneNumber'),
  services: json('services').$type<Record<string, boolean>>(),
  types: json('types').$type<string[]>(),
  photos: json('photos').$type<
    Array<{
      reference: string;
      width: number;
      height: number;
      url: string;
    }>
  >(),
  disabled: boolean('disabled').default(false).notNull(),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const restaurantsTableRelations = relations(restaurantsTable, ({ one }) => ({
  organization: one(organizationsTable, {
    fields: [restaurantsTable.organizationId],
    references: [organizationsTable._id],
  }),
  reviews: one(restaurantReviewsTable, {
    fields: [restaurantsTable._id],
    references: [restaurantReviewsTable.restaurantId],
  }),
}));

export const restaurantReviewsTable = pgTable('restaurant_reviews', {
  _id: uuid('id').primaryKey().defaultRandom(),
  restaurantId: uuid('restaurantId')
    .notNull()
    .references(() => restaurantsTable._id),
  google: json('google').$type<
    Array<{
      authorName: string;
      authorPhoto: string;
      rating: number;
      text: string;
      createdAt: string;
    }>
  >(),
});

export const restaurantReviewsTableRelations = relations(restaurantReviewsTable, ({ one, many }) => ({
  restaurant: one(restaurantsTable, {
    fields: [restaurantReviewsTable.restaurantId],
    references: [restaurantsTable._id],
  }),
  internal: many(internalRestaurantReviewsTable),
}));

export const internalRestaurantReviewsTable = pgTable('internal_restaurant_reviews', {
  _id: uuid('id').primaryKey().defaultRandom(),
  restaurantReviewId: uuid('restaurantReviewId')
    .notNull()
    .references(() => restaurantReviewsTable._id),
  userId: uuid('userId')
    .notNull()
    .references(() => usersTable._id),
  rating: integer('rating'),
  text: varchar('text'),
});

export const internalRestaurantReviewsTableRelations = relations(
  internalRestaurantReviewsTable,
  ({ one }) => ({
    restaurantReview: one(restaurantReviewsTable, {
      fields: [internalRestaurantReviewsTable.restaurantReviewId],
      references: [restaurantReviewsTable._id],
    }),
    user: one(usersTable, {
      fields: [internalRestaurantReviewsTable.userId],
      references: [usersTable._id],
    }),
  }),
);

export const lunchGroupsTable = pgTable('lunch_groups', {
  _id: uuid('id').primaryKey().defaultRandom(),
  label: varchar('label').notNull(),
  description: varchar('description'),
  status: varchar('status', { length: 20 }).notNull().$type<'open' | 'closed'>(),
  meetingTime: varchar('meetingTime'),
  userSlots: integer('userSlots'),
  restaurantId: uuid('restaurantId')
    .notNull()
    .references(() => restaurantsTable._id),
  organizationId: uuid('organizationId').references(() => organizationsTable._id),
  ownerId: uuid('ownerId')
    .notNull()
    .references(() => usersTable._id),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const lunchGroupsTableRelations = relations(lunchGroupsTable, ({ one, many }) => ({
  restaurant: one(restaurantsTable, {
    fields: [lunchGroupsTable.restaurantId],
    references: [restaurantsTable._id],
  }),
  organization: one(organizationsTable, {
    fields: [lunchGroupsTable.organizationId],
    references: [organizationsTable._id],
  }),
  owner: one(usersTable, {
    fields: [lunchGroupsTable.ownerId],
    references: [usersTable._id],
  }),
  users: many(lunchGroupUsersTable),
}));

export const lunchGroupUsersTable = pgTable('lunch_group_users', {
  _id: uuid('id').primaryKey().defaultRandom(),
  lunchGroupId: uuid('lunchGroupId')
    .notNull()
    .references(() => lunchGroupsTable._id),
  userId: uuid('userId')
    .notNull()
    .references(() => usersTable._id),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const lunchGroupUsersTableRelations = relations(lunchGroupUsersTable, ({ one }) => ({
  lunchGroup: one(lunchGroupsTable, {
    fields: [lunchGroupUsersTable.lunchGroupId],
    references: [lunchGroupsTable._id],
  }),
  user: one(usersTable, {
    fields: [lunchGroupUsersTable.userId],
    references: [usersTable._id],
  }),
}));

export const lunchGroupPollsTable = pgTable('lunch_group_polls', {
  _id: uuid('id').primaryKey().defaultRandom(),
  label: varchar('label').notNull(),
  description: varchar('description'),
  status: varchar('status', { length: 20 }).notNull().$type<'open' | 'closed'>(),
  voteDeadline: timestamp('voteDeadline', { mode: 'string' }).notNull(),
  meetingTime: varchar('meetingTime'),
  organizationId: uuid('organizationId')
    .notNull()
    .references(() => organizationsTable._id),
  ownerId: uuid('ownerId')
    .notNull()
    .references(() => usersTable._id),
  lunchGroupId: uuid('lunchGroupId').references(() => lunchGroupsTable._id),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const lunchGroupPollsTableRelations = relations(lunchGroupPollsTable, ({ one, many }) => ({
  organization: one(organizationsTable, {
    fields: [lunchGroupPollsTable.organizationId],
    references: [organizationsTable._id],
  }),
  owner: one(usersTable, {
    fields: [lunchGroupPollsTable.ownerId],
    references: [usersTable._id],
  }),
  lunchGroup: one(lunchGroupsTable, {
    fields: [lunchGroupPollsTable.lunchGroupId],
    references: [lunchGroupsTable._id],
  }),
  restaurants: many(lunchGroupPollsRestaurantsTable),
  pollEntries: many(lunchGroupPollEntriesTable),
}));

export const lunchGroupPollsRestaurantsTable = pgTable('lunch_group_polls_restaurants', {
  _id: uuid('id').primaryKey().defaultRandom(),
  lunchGroupPollId: uuid('lunchGroupPollId')
    .notNull()
    .references(() => lunchGroupPollsTable._id),
  restaurantId: uuid('restaurantId')
    .notNull()
    .references(() => restaurantsTable._id),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const lunchGroupPollsRestaurantsTableRelations = relations(
  lunchGroupPollsRestaurantsTable,
  ({ one }) => ({
    lunchGroupPoll: one(lunchGroupPollsTable, {
      fields: [lunchGroupPollsRestaurantsTable.lunchGroupPollId],
      references: [lunchGroupPollsTable._id],
    }),
    restaurant: one(restaurantsTable, {
      fields: [lunchGroupPollsRestaurantsTable.restaurantId],
      references: [restaurantsTable._id],
    }),
  }),
);

export const lunchGroupPollEntriesTable = pgTable('lunch_group_poll_entries', {
  _id: uuid('id').primaryKey().defaultRandom(),
  lunchGroupPollId: uuid('lunchGroupPollId')
    .notNull()
    .references(() => lunchGroupPollsTable._id),
  userId: uuid('userId')
    .notNull()
    .references(() => usersTable._id),
  restaurantId: uuid('restaurantId')
    .notNull()
    .references(() => restaurantsTable._id),
  createdAt: timestamp('createdAt', { mode: 'string' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'string' }).notNull().defaultNow(),
});

export const lunchGroupPollEntriesTableRelations = relations(lunchGroupPollEntriesTable, ({ one }) => ({
  lunchGroupPoll: one(lunchGroupPollsTable, {
    fields: [lunchGroupPollEntriesTable.lunchGroupPollId],
    references: [lunchGroupPollsTable._id],
  }),
  user: one(usersTable, {
    fields: [lunchGroupPollEntriesTable.userId],
    references: [usersTable._id],
  }),
  restaurant: one(restaurantsTable, {
    fields: [lunchGroupPollEntriesTable.restaurantId],
    references: [restaurantsTable._id],
  }),
}));

export const queueJobsTable = pgTable('queue_jobs', {
  _id: uuid('id').primaryKey().defaultRandom(),
  queue: varchar('queue').notNull().$type<'map' | 'email'>(),
  params: json('params').$type<z.infer<typeof queueJobParamsSchema>>().notNull(),
  result: json('result').$type<z.infer<typeof queueJobResultSchema>[]>().default([]).notNull(),
  status: varchar('status', { length: 20 })
    .notNull()
    .$type<'pending' | 'processing' | 'completed' | 'failed'>()
    .default('pending'),
  attempts: integer('attempts').notNull().default(0),
  deferJobId: varchar('defer_job_id').notNull().default(''),
});
