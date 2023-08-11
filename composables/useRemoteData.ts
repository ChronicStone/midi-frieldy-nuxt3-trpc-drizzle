import { WatchSource } from 'vue';

export function useRemoteData<T extends (...args: any[]) => Promise<any>>(
  resolver: T,
  options?: {
    watch?: WatchSource[];
    immediate?: boolean;
    deepWatch?: boolean;
    onError?: <T>(err: T) => any;
  },
) {
  const data = ref<Awaited<ReturnType<T>> | null>(null);
  const pending = ref(false);

  async function refresh() {
    try {
      pending.value = true;
      data.value = await resolver();
    } catch (err) {
      options?.onError?.(err);
      console.error(err);
    } finally {
      pending.value = false;
    }
  }

  if (options?.watch) {
    watch(options.watch, refresh, { deep: options?.deepWatch ?? false });
  }

  if (options?.immediate ?? true) {
    refresh();
  }

  return { data, pending, refresh };
}
