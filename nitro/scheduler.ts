import { consola } from 'consola';
import { localScheduler } from '@/server/scheduler';
import { lunchGroupCron } from '@/server/defer/cron/lunchGroup.cron';

export default defineNitroPlugin(() => {
  if (typeof lunchGroupCron === 'function') {
    lunchGroupCron();
  }
});
