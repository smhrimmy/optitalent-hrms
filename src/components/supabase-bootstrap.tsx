import { readPublicSupabaseConfig } from '@/lib/supabase-public';

/** Injects runtime URL/anon so the browser never uses a build-time placeholder host. */
export function SupabaseBootstrap() {
  const cfg = readPublicSupabaseConfig();
  const payload = JSON.stringify(cfg).replace(/</g, '\\u003c');
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `window.__OT_SUPABASE__=${payload};`,
      }}
    />
  );
}
