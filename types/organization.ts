import { InferModel } from 'drizzle-orm';
import { organizationsTable } from '@/db/schema';
import { RouterOutput } from '@/server/trpc/router';

export type Organization = InferModel<typeof organizationsTable>;
export type OrganizationList = RouterOutput['organization']['getOrganizations'];
