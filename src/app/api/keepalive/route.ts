import { NextResponse } from 'next/server';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabase-admin';
import { authorize } from '@/lib/authorization/engine';
import { getCompanyContext } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

function authorized(req: Request): boolean {
  const secret = process.env.KEEPALIVE_API_KEY || process.env.CRON_SECRET || '';
  if (!secret) return false;

  const auth = req.headers.get('authorization') || '';
  const bearer = auth.replace(/^Bearer\s+/i, '').trim();
  const headerKey = req.headers.get('x-api-key') || '';
  const urlKey = new URL(req.url).searchParams.get('key') || '';

  return bearer === secret || headerKey === secret || urlKey === secret;
}

async function ping(req: Request) {
  let isCron = false;
  if (!authorized(req)) {
    const context = await getCompanyContext();
    if (!context) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const authResult = authorize({ context, resource: 'system', action: 'run' });
    if (!authResult.allowed) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  } else {
      isCron = true;
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: 'Supabase is not configured', ok: false },
      { status: 503 }
    );
  }

  const supabase = getSupabaseAdmin();
  const source = req.headers.get('x-vercel-cron') ? 'vercel-cron' : 'api';
  const { data, error } = await supabase.rpc('touch_heartbeat', { p_source: source });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    heartbeat: data,
    at: new Date().toISOString(),
  });
}

export async function GET(req: Request) {
  return ping(req);
}

export async function POST(req: Request) {
  return ping(req);
}
