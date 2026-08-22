export type PublicSupabaseConfig = {
  url: string;
  anon: string;
  configured: boolean;
};

function cleanUrl(value: string | undefined): string {
  return (value || '').trim().replace(/\/$/, '');
}

function isUsableUrl(url: string): boolean {
  if (!url) return false;
  if (url.includes('placeholder')) return false;
  if (url.includes('YOUR_')) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && !parsed.hostname.startsWith('placeholder');
  } catch {
    return false;
  }
}

/** Server + build-time env. Never returns the fake placeholder hostname. */
export function readPublicSupabaseConfig(): PublicSupabaseConfig {
  const url = cleanUrl(
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  );
  const anon = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    ''
  ).trim();
  const configured = isUsableUrl(url) && Boolean(anon) && !anon.includes('placeholder');
  return { url: configured ? url : '', anon: configured ? anon : '', configured };
}

export const SUPABASE_MISSING_MESSAGE =
  'Supabase is not configured in this deployment. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_URL / SUPABASE_ANON_KEY) on Vercel for Production and Preview, then redeploy.';
