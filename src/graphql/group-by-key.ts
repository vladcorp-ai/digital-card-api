/**
 * Orders batched rows for DataLoader: one result array per requested key,
 * in the same order as the keys (empty array when a key has no rows).
 */
export function groupByKey<T, K>(keys: readonly K[], rows: T[], keyOf: (row: T) => K): T[][] {
  const groups = new Map<K, T[]>(keys.map((key) => [key, []]));
  for (const row of rows) {
    groups.get(keyOf(row))?.push(row);
  }
  return keys.map((key) => groups.get(key) ?? []);
}
