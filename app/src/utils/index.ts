export function omit<T extends object, K extends keyof T>(target: T, ...omitKeys: K[]): Omit<T, K> {
  return (Object.keys(target) as K[]).reduce(
    (res, key) => {
      if (!omitKeys.includes(key)) {
        res[key] = target[key];
      }
      return res;
    },
    {} as any,
  );
}

export function filterObject(o: object, recommendations: string[]): object {
  let filtered = {};
  if (recommendations.length) {
    Object.entries(o).forEach(kv => {
      const [key, value] = kv;
      if (recommendations.includes(key)) {
        filtered[key] = value;
      }
    });
  } else {
    filtered = { ...o };
  }
  return o;
}
