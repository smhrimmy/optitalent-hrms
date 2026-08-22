export type PublicSupabaseConfig = {
  url: string;
  anon: string;
  configured: boolean;
};

/** Public project credentials (anon key is designed for the browser). Env overrides these. */
export const DEFAULT_SUPABASE_URL = 'https://fytzlpnitskuszrvijik.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ5dHpscG5pdHNrdXN6cnZpamlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODczODkzODUsImV4cCI6MjEwMjk2NTM4NX0.cq3D9XejXW3b2ABuTaSbbhS_RQtpRnbcf9EdmafSM9k';

function cleanUrl(value: string | undefined): string {
  return (value || '').trim().replace(/\/$/, '');
}

function isUsableUrl(url: string): boolean {
  if (!url) return false;
  if (url.includes('placeholder')) return false;
  if (url.includes('YOUR_')) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname.endsWith('supabase.co');
  } catch {
    return false;
  }
}

function pickUrl(): string {
  const fromEnv = cleanUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL);
  return isUsableUrl(fromEnv) ? fromEnv : DEFAULT_SUPABASE_URL;
}

function pickAnon(): string {
  const fromEnv = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    ''
  ).trim();
  if (fromEnv && !fromEnv.includes('placeholder') && !fromEnv.includes('YOUR_')) return fromEnv;
  return DEFAULT_SUPABASE_ANON_KEY;
}

/** Always a real project URL — never placeholder-project.supabase.co. */
export function readPublicSupabaseConfig(): PublicSupabaseConfig {
  const url = pickUrl();
  const anon = pickAnon();
  return { url, anon, configured: isUsableUrl(url) && Boolean(anon) };
}

export const SUPABASE_MISSING_MESSAGE =
  'Supabase is not configured in this deployment. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY on Vercel, then redeploy.';
