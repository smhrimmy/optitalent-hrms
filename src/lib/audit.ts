export type AuditEvent = {
  id: string;
  at: string;
  actor: string;
  action: string;
  detail: string;
};

const KEY = 'ot_audit_log';

export function readAudit(): AuditEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function appendAudit(actor: string, action: string, detail: string) {
  const events = readAudit();
  events.unshift({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    actor,
    action,
    detail,
  });
  localStorage.setItem(KEY, JSON.stringify(events.slice(0, 200)));
}
