'use client';

import { useSyncExternalStore } from 'react';
import {
  dataQuery,
  getDataQuerySnapshot,
  hydrateDataQuery,
  subscribeDataQuery,
  type HrmsDatabase,
} from '@/lib/dataquery';

let hydrated = false;

export function useDataQuery(): HrmsDatabase {
  const snapshot = useSyncExternalStore(
    subscribeDataQuery,
    getDataQuerySnapshot,
    getDataQuerySnapshot
  );

  if (typeof window !== 'undefined' && !hydrated) {
    hydrated = true;
    hydrateDataQuery();
  }

  return snapshot;
}

export { dataQuery };
