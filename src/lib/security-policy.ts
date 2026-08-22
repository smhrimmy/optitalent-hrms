export type SecurityPolicy = {
  lockdown: boolean;
  mfaRequired: boolean;
  waf: Record<string, boolean>;
  blockedIps: { ip: string; reason: string; date: string }[];
  sslAutoRenew: Record<string, boolean>;
};

const KEY = 'ot_security_policy';
const COOKIE = 'ot_lockdown';

export const defaultPolicy: SecurityPolicy = {
  lockdown: false,
  mfaRequired: false,
  waf: {
    sql: true,
    xss: true,
    rfi: true,
    bots: true,
    rate: true,
  },
  blockedIps: [],
  sslAutoRenew: { wildcard: true, api: true },
};

export function readSecurity(): SecurityPolicy {
  if (typeof window === 'undefined') return defaultPolicy;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultPolicy, ...JSON.parse(raw) } : defaultPolicy;
  } catch {
    return defaultPolicy;
  }
}

export function writeSecurity(next: SecurityPolicy) {
  localStorage.setItem(KEY, JSON.stringify(next));
  document.cookie = `${COOKIE}=${next.lockdown ? '1' : '0'}; path=/; SameSite=Lax`;
}

export function isLockdownCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  return /(?:^|;\s*)ot_lockdown=1(?:;|$)/.test(cookieHeader);
}
