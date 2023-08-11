import { InferModel } from 'drizzle-orm';
import { z } from 'zod';
import { invitationsTable } from '@/db/schema';
import { acceptInvitationDto } from '@/server/dto/invitation.dto';
import { RouterOutput } from '@/server/trpc/router';

export type AcceptInvitationDto = z.infer<typeof acceptInvitationDto>;
export type InvitationPayload = RouterOutput['invitation']['validateInvitation'];

export type UserInvitation = InferModel<typeof invitationsTable>;
export type UserInvitationsList = RouterOutput['invitation']['getInvitations'];
