export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result: any = {};
  for (const key of keys) {
    result[key] = obj[key];
  }
  return result;
}

export function omit<T extends object, K extends keyof T, R extends Omit<T, K>>(obj: T, keys: K[]): R {
  const result: any = {};
  for (const key in obj) {
    if (!keys.includes(key as any)) {
      result[key] = obj[key];
    }
  }
  return result;
}
