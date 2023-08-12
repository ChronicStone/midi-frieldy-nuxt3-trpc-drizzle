import { addMetadata, defer } from '@defer/client';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { getRestaurantsNearby } from '@/server/services/googleMaps.service';
import { createOrganizationRestaurants } from '@/server/services/restaurant.service';
import {
  createQueueJob,
  startQueueJobProcessing,
  completeQueueJob,
} from '@/server/services/queueJob.service';

export async function resolveOrganizationRestaurants(organizationId: string, jobId?: string) {
  const _jobId =
    jobId! ||
    (await createQueueJob('map', {
      operation: 'resolveRestaurant',
      params: { organizationId },
    }).then((job) => job._id));
  const handler = addMetadata(organizationQueue, { organizationId, jobId: _jobId });
  return handler(_jobId);
}

const organizationQueue = defer(async (jobId: string) => {
  const job = await db.query.queueJobsTable.findFirst({
    where: (t) => eq(t._id, jobId),
  });

  if (!job) return { success: false, message: 'Job not found' };
  await startQueueJobProcessing(job);

  if (job.queue !== 'map') return completeQueueJob(job, { success: false, message: 'Invalid queue' });
  if (job.status === 'completed')
    return completeQueueJob(job, { success: false, message: 'Job already completed' });
  if (job.params.operation !== 'resolveRestaurant')
    return completeQueueJob(job, { success: false, message: 'Invalid operation' });

  const organizationId = job.params.params.organizationId;
  const organization = await db.query.organizationsTable.findFirst({
    where: (t) => eq(t._id, organizationId),
  });

  if (!organization) return completeQueueJob(job, { success: false, message: 'Organization not found' });

  if (!organization)
    return completeQueueJob(job, {
      success: false,
      message: 'Organization not found',
    });

  const nearbyRestaurants = await getRestaurantsNearby(organization.coordinates);
  await createOrganizationRestaurants(organizationId, nearbyRestaurants);
  return completeQueueJob(job, { success: true });
});
