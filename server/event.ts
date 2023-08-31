import EventEmitter from 'events';
import TypedEmitter from 'typed-emitter';
import { createLunchGroup, createLunchGroupPoll } from '@/server/services/lunchGroup.service';

export const mapEvents = new EventEmitter() as TypedEmitter<{
  groupCreated: (group: Awaited<ReturnType<typeof createLunchGroup>>) => void;
  groupDeleted: (params: { organizationId: string; groupId: string }) => void;
  userJoinedGroup: (params: {
    userId: string;
    userEntryId: string;
    organizationId: string;
    groupId: string;
  }) => void;
  userLeftGroup: (params: { userId: string; organizationId: string; groupId: string }) => void;
  userOnlineStatusChanged: (params: { userId: string; organizationId: string; online: boolean }) => void;
  groupPollCreated: (poll: Awaited<ReturnType<typeof createLunchGroupPoll>>) => void;
  userVotedToPoll: (params: {
    userId: string;
    organizationId: string;
    pollId: string;
    restaurantId: string;
    entryId: string;
  }) => void;
  groupPollEnded: (params: { organizationId: string; pollId: string }) => void;
}>;
