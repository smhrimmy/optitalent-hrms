import { NextResponse } from 'next/server';
import { readPublicSupabaseConfig } from '@/lib/supabase-public';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cfg = readPublicSupabaseConfig();
  return NextResponse.json({
    configured: cfg.configured,
    urlHost: cfg.url ? new URL(cfg.url).host : null,
  });
}
