import { NextResponse } from 'next/server';
import { getCompanyContext } from '@/lib/auth-server';
import { authorize } from '@/lib/authorization/engine';

export const dynamic = 'force-dynamic';

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'OptiTalent HTTP API',
    version: '0.1.0',
    description: 'Routes this Next.js app actually exposes. Company data lives in Supabase, not here.',
  },
  paths: {
    '/api/health': {
      get: { summary: 'Liveness', responses: { '200': { description: 'OK' } } },
    },
    '/api/keepalive': {
      post: { summary: 'Touch Supabase heartbeat (API key required)' },
    },
    '/api/companys/provision': {
      post: { summary: 'Create a company when service role is configured' },
    },
    '/api/public-config': {
      get: { summary: 'Public runtime config' },
    },
  },
};

export async function GET() {
  const context = await getCompanyContext();
  if (!context) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const authResult = authorize({
      context,
      resource: 'platform.system',
      action: 'view'
  });
  
  if (!authResult.allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(spec);
}
