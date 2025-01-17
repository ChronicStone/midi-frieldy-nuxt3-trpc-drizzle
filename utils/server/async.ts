import { consola } from 'consola';

export function rateLimitPromiseQueue<T = any>(
  promises: Array<(options?: { signal?: AbortSignal }) => Promise<T>>,
  options: { concurrency: number; interval: number; runsPerInterval: number },
): Promise<[T[], any[]]> {
  return new Promise(async (resolve, reject) => {
    consola.info(
      `Rate limiting ${promises.length} promises with concurrency ${options.concurrency} and interval ${options.interval}ms`,
      'rateLimitPromiseQueue',
    );
    try {
      const PQueue = (await import('p-queue')).default;
      const success: T[] = [];
      const errors: unknown[] = [];
      const queue = new PQueue({
        concurrency: options.concurrency,
        interval: options.interval,
        intervalCap: options.runsPerInterval,
      });

      queue.on('error', (error) => consola.error(error, 'rateLimitPromiseQueue'));
      queue.on('completed', (result) => {
        success.push(result);
        consola.info(
          `Promise completed, ${queue.size} remaining, ${queue.pending} pending`,
          'rateLimitPromiseQueue',
        );
      });
      queue.on('idle', () => resolve([success, errors]));
      queue.on('error', (error) => errors.push(error));
      queue.addAll(promises);
      if (!promises.length) resolve([success, errors]);
    } catch (err) {
      reject(err);
    }
  });
}
