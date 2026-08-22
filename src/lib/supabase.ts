import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types';
import {
  readPublicSupabaseConfig,
  SUPABASE_MISSING_MESSAGE,
  type PublicSupabaseConfig,
} from './supabase-public';

declare global {
  interface Window {
    __OT_SUPABASE__?: PublicSupabaseConfig;
  }
}

let browserClient: SupabaseClient<Database> | null = null;

function resolveConfig(): PublicSupabaseConfig {
  if (typeof window !== 'undefined' && window.__OT_SUPABASE__?.configured) {
    return window.__OT_SUPABASE__;
  }
  return readPublicSupabaseConfig();
}

export function isSupabaseConfigured(): boolean {
  return resolveConfig().configured;
}

export function getSupabase(): SupabaseClient<Database> {
  const cfg = resolveConfig();
  if (!cfg.configured) {
    throw new Error(SUPABASE_MISSING_MESSAGE);
  }
  if (typeof window === 'undefined') {
    return createClient<Database>(cfg.url, cfg.anon);
  }
  if (!browserClient) {
    browserClient = createClient<Database>(cfg.url, cfg.anon, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    });
  }
  return browserClient;
}

const missingAuthError = { message: SUPABASE_MISSING_MESSAGE, status: 503, name: 'AuthRetryableFetchError' };

/** Drop-in client: real SDK when configured, no DNS to a fake host when not. */
export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop, receiver) {
    if (prop === 'auth' && !resolveConfig().configured) {
      return {
        getSession: async () => ({ data: { session: null }, error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        signUp: async () => ({ data: { user: null, session: null }, error: missingAuthError }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: missingAuthError }),
        signInWithOAuth: async () => ({ data: { provider: 'google', url: null }, error: missingAuthError }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } }, error: null }),
      };
    }
    try {
      const client = getSupabase();
      const value = Reflect.get(client, prop, receiver);
      return typeof value === 'function' ? value.bind(client) : value;
    } catch {
      if (prop === 'from') {
        return () => ({
          select: () => ({
            eq: () => ({
              single: async () => ({ data: null, error: { message: SUPABASE_MISSING_MESSAGE } }),
              maybeSingle: async () => ({ data: null, error: { message: SUPABASE_MISSING_MESSAGE } }),
              then: (resolve: (v: unknown) => void) =>
                resolve({ data: null, error: { message: SUPABASE_MISSING_MESSAGE } }),
            }),
            order: () => ({
              limit: async () => ({ data: [], error: { message: SUPABASE_MISSING_MESSAGE } }),
            }),
          }),
          insert: async () => ({ data: null, error: { message: SUPABASE_MISSING_MESSAGE } }),
          update: () => ({ eq: async () => ({ data: null, error: { message: SUPABASE_MISSING_MESSAGE } }) }),
        });
      }
      throw new Error(SUPABASE_MISSING_MESSAGE);
    }
  },
});
