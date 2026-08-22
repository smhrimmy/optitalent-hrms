'use client';

import { useCallback, useEffect, useState } from 'react';

export function useLocalCollection<T extends { id: string }>(key: string, seed: T[]) {
  const [items, setItems] = useState<T[]>(seed);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setItems(JSON.parse(raw));
      else localStorage.setItem(key, JSON.stringify(seed));
    } catch {
      setItems(seed);
    } finally {
      setReady(true);
    }
  }, [key]);

  const persist = useCallback(
    (next: T[]) => {
      setItems(next);
      localStorage.setItem(key, JSON.stringify(next));
    },
    [key]
  );

  return { items, ready, persist };
}
