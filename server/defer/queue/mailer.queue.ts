import { addMetadata, defer } from '@defer/client';
import { eq } from 'drizzle-orm';
import { hashPassword } from '@/utils/server/bcrypt';
import { db } from '@/db';
import { queueJobsTable } from '@/db/schema';
import {
  createQueueJob,
  startQueueJobProcessing,
  completeQueueJob,
} from '@/server/services/queueJob.service';
import { rateLimitPromiseQueue } from '@/utils/server/async';
import { sendInvitationEmail } from '@/server/services/mailer.service';
import { env } from '@/server/env';

export async function queueInvitationEmails(invitationId: string, jobId?: string) {
  const _jobId =
    jobId! ||
    (await createQueueJob('email', {
      operation: 'sendInvitationEmail',
      params: { invitationId },
    }).then((job) => job._id));
  const handler = addMetadata(emailSendQueue, { jobId: _jobId });
  const jobRef = await handler(_jobId);

  db.update(queueJobsTable).set({ deferJobId: jobRef.id });
  return jobRef.id;
}

export const emailSendQueue = defer(async (jobId: string) => {
  const job = await db.query.queueJobsTable.findFirst({
    where: (t) => eq(t._id, jobId),
  });

  if (!job) return { success: false, message: 'Job not found' };
  await startQueueJobProcessing(job);

  if (job.queue !== 'email') return completeQueueJob(job, { success: false, message: 'Invalid queue' });
  if (job.status === 'completed')
    return completeQueueJob(job, { success: false, message: 'Job already completed' });
  if (job.params.operation !== 'sendInvitationEmail')
    return completeQueueJob(job, { success: false, message: 'Invalid operation' });

  const invitationId = job.params.params.invitationId;
  const invitation = await db.query.invitationsTable.findFirst({
    where: (t) => eq(t._id, invitationId),
    with: { organization: true },
  });

  if (!invitation) return completeQueueJob(job, { success: false, message: 'Invitation not found' });
  if (invitation.type !== 'email')
    return completeQueueJob(job, { success: false, message: 'Invalid invitation type' });

  await rateLimitPromiseQueue(
    invitation.emails.map(
      (email) => () =>
        sendInvitationEmail({
          email,
          invitationLink: `${env.CLIENT_APP_URL}/auth/invitation/${invitation._id}?hash=${encodeURIComponent(
            hashPassword(email),
          )}`,
          expireAt: invitation.expireAt,
          organization: invitation.organization?.name,
        }),
    ),
    {
      concurrency: 1,
      interval: 1100,
      runsPerInterval: 1,
    },
  );

  return completeQueueJob(job, { success: true });
});
