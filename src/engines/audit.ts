export type AuditEvent = {
  id: string;
  at: string;
  user: string;
  role: string;
  entity: string;
  record: string;
  action: string;
  before?: string;
  after?: string;
  reason?: string;
  source: 'ui' | 'api' | 'ai';
  approvedBy?: string;
  tenantId: string;
};

const KEY = 'optitalent_audit_v1';
const listeners = new Set<() => void>();

function load(): AuditEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

let events: AuditEvent[] = [];

export function hydrateAudit() {
  events = load();
}

export function listAudit(): AuditEvent[] {
  return events;
}

export function recordAudit(input: Omit<AuditEvent, 'id' | 'at'>): AuditEvent {
  const rec: AuditEvent = {
    ...input,
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    at: new Date().toISOString(),
  };
  events = [rec, ...events].slice(0, 400);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(KEY, JSON.stringify(events));
    } catch {
      /* quota */
    }
  }
  listeners.forEach((l) => l());
  return rec;
}

export function subscribeAudit(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
