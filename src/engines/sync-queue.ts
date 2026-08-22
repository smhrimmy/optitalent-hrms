/** Offline-first attendance: write locally, queue if offline, drain when online. */

export type SyncItem = {
  id: string;
  kind: 'clock';
  payload: { employeeId: string };
  at: string;
  status: 'pending' | 'synced' | 'conflict';
};

const KEY = 'optitalent_sync_queue_v1';

function read(): SyncItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function write(items: SyncItem[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function enqueueClock(employeeId: string): SyncItem {
  const item: SyncItem = {
    id: `sync-${Date.now()}`,
    kind: 'clock',
    payload: { employeeId },
    at: new Date().toISOString(),
    status: typeof navigator !== 'undefined' && navigator.onLine === false ? 'pending' : 'synced',
  };
  write([item, ...read()].slice(0, 200));
  return item;
}

export function pendingSync(): SyncItem[] {
  return read().filter((i) => i.status === 'pending');
}

export function markSynced(id: string) {
  write(read().map((i) => (i.id === id ? { ...i, status: 'synced' } : i)));
}
