
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types';

// SECURITY NOTE:
// We use environment variables to store sensitive keys.
// This prevents them from being exposed in the source code repository (like GitHub).
// The 'NEXT_PUBLIC_' prefix makes them available to the browser.
// The Anon Key is safe to expose in the browser because it is restricted by Row Level Security (RLS) policies on the server.
const databaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const databaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(databaseUrl, databaseAnonKey);
