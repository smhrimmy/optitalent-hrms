export type OrgConfig = {
  currency: string;
  locale: string;
  timezone: string;
  name: string;
};

const KEY = 'ot_org_config';

export const defaultOrg: OrgConfig = {
  currency: 'INR',
  locale: 'en-IN',
  timezone: 'Asia/Kolkata',
  name: 'OptiTalent Demo',
};

export function readOrg(): OrgConfig {
  if (typeof window === 'undefined') return defaultOrg;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaultOrg, ...JSON.parse(raw) } : defaultOrg;
  } catch {
    return defaultOrg;
  }
}

export function writeOrg(next: OrgConfig) {
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function formatMoney(amount: number, org: OrgConfig = defaultOrg) {
  try {
    return new Intl.NumberFormat(org.locale, {
      style: 'currency',
      currency: org.currency,
    }).format(amount);
  } catch {
    return `${org.currency} ${amount.toFixed(2)}`;
  }
}
