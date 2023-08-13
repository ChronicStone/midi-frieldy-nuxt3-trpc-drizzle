import { InferModel } from 'drizzle-orm';
import { RouterOutput } from '@/server/trpc/router';

export type LunchGroup = InferModel<typeof lunchGroupsTable>;
export type LunchGroupPoll = InferModel<typeof lunchGroupPollsTable>;

export type LunchGroupList = RouterOutput['lunchGroup']['getLunchGroups'];
export type LunchGroupPollList = RouterOutput['lunchGroup']['getLunchGroupPolls'];
