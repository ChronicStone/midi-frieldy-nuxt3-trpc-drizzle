import { InferModel } from 'drizzle-orm';

export type QueueJob = InferModel<typeof queueJobsTable>;
