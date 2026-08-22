import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { DEFAULT_SUPABASE_URL } from './supabase-public';

const PLACEHOLDER_KEY = 'placeholder-service-role-key';

function readAdminEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '';
  const configured = Boolean(
    url &&
      key &&
      !url.includes('placeholder') &&
      !url.includes('YOUR_') &&
      !key.includes('placeholder') &&
      !key.includes('YOUR_')
  );
  return { url, key, configured };
}

export function isSupabaseAdminConfigured(): boolean {
  return readAdminEnv().configured;
}

/** Safe at import time so Next can collect page data without credentials. */
export function getSupabaseAdmin(): SupabaseClient {
  const { url, key, configured } = readAdminEnv();
  return createClient(configured ? url : DEFAULT_SUPABASE_URL, configured ? key : PLACEHOLDER_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export const supabaseAdmin = getSupabaseAdmin();
