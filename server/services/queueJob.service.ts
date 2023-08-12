import { InferModel, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { queueJobsTable } from '@/db/schema';
import { queueJobResultSchema } from '@/server/dto/queueJob.dto';

type QueueJob = InferModel<typeof queueJobsTable>;
type QueueJobResult = z.infer<typeof queueJobResultSchema>;

type TypedQueueJobParams<Q extends QueueJob['queue']> = QueueJob['params'] &
  (Q extends 'map'
    ? { operation: 'resolveRestaurant' }
    : Q extends 'email'
    ? { operation: 'sendInvitationEmail' }
    : never);

export function createQueueJob<Q extends QueueJob['queue'], P extends TypedQueueJobParams<Q>>(
  queue: Q,
  params: P,
) {
  return db
    .insert(queueJobsTable)
    .values({ queue, params })
    .returning()
    .then((job) => job[0]);
}

export function startQueueJobProcessing(job: QueueJob) {
  return db
    .update(queueJobsTable)
    .set({
      status: 'processing',
    })
    .where(eq(queueJobsTable._id, job._id));
}

export async function completeQueueJob(job: QueueJob, result: QueueJobResult) {
  await db
    .update(queueJobsTable)
    .set({
      status: result.success ? 'completed' : 'failed',
      attempts: job.attempts + 1,
      result,
    })
    .where(eq(queueJobsTable._id, job._id));

  return result;
}
