import { buildTableSchema } from '@chronicstone/vue-sweettools';
import { QueueJob } from '@/types/queueJob';

export function queueJobsTableSchema() {
  const { $client } = useNuxtApp();
  return buildTableSchema<QueueJob>({
    remote: false,
    columns: [],
    datasource: () => $client.queueJob.getJobs.query(),
  });
}
