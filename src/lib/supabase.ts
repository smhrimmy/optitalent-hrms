import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import { readPublicSupabaseConfig, type PublicSupabaseConfig } from './supabase-public';

declare global {
  interface Window {
    __OT_SUPABASE__?: PublicSupabaseConfig;
  }
}

function resolveConfig(): PublicSupabaseConfig {
  if (typeof window !== 'undefined') {
    const injected = window.__OT_SUPABASE__;
    if (injected?.url && !injected.url.includes('placeholder') && injected.anon) {
      return injected;
    }
  }
  return readPublicSupabaseConfig();
}

const cfg = resolveConfig();

export function isSupabaseConfigured(): boolean {
  return Boolean(cfg.url) && !cfg.url.includes('placeholder');
}

export function getSupabase(): SupabaseClient<Database> {
  return supabase;
}

export const supabase = createClient<Database>(cfg.url, cfg.anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
