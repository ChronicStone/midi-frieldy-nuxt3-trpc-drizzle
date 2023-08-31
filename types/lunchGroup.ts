import { InferSelectModel } from 'drizzle-orm';
import { RouterOutput } from '@/server/trpc/router';

export type LunchGroup = InferSelectModel<typeof lunchGroupsTable>;
export type LunchGroupPoll = InferSelectModel<typeof lunchGroupPollsTable>;

export type LunchGroupList = RouterOutput['lunchGroup']['getLunchGroups'];
export type LunchGroupListItem = LunchGroupList[number];
export type LunchGroupPollList = RouterOutput['lunchGroup']['getLunchGroupPolls'];
export type LunchGroupPollListItem = LunchGroupPollList[number];

export type LunchGroupUser = InferSelectModel<typeof lunchGroupUsersTable>;
