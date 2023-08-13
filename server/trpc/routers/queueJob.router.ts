import { protectedProcedure, router } from '@/server/trpc/trpc';

export const queueJobRouter = router({
  getJobs: protectedProcedure.query(({ ctx }) => ctx.db.query.queueJobsTable.findMany()),
});
