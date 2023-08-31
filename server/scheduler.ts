import { defer } from '@defer/client';
import { useScheduler } from '#scheduler';
import { env } from '@/server/env';

export const localScheduler = useScheduler();

export function scheduleTask(task: () => Promise<void>, cron: string) {
  return env.APP_ENV === 'production' ? defer.cron(task, cron) : () => localScheduler.run(task).cron(cron);
}
