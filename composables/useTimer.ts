export function useTimer(timestamp: string) {
  const value = ref<string>(getRawTimeDiff(timestamp) as string);
  const interval = setInterval(() => {
    value.value = getRawTimeDiff(timestamp) as string;
  }, 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });

  return value;
}

export function useTimerPercentage(deadline: string, start: string) {
  // RETURN PERCENTAGE OF TIME REMAINING
  const value = ref<number>(getRawTimeDiff(deadline, start, true) as number);
  const interval = setInterval(() => {
    value.value = getRawTimeDiff(deadline, start, true) as number;
  }, 1000);

  onUnmounted(() => {
    clearInterval(interval);
  });

  return value;
}
