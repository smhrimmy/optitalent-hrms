import { readSecurity } from '@/lib/security-policy';

export function postLoginPath(fallback: string) {
  if (typeof window === 'undefined') return fallback;
  const p = readSecurity();
  if (p.mfaRequired && sessionStorage.getItem('ot_mfa_ok') !== '1') return '/mfa';
  return fallback;
}
