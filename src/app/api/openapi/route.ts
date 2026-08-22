import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'OptiTalent HTTP API',
    version: '0.1.0',
    description: 'Routes this Next.js app actually exposes. Tenant data lives in Supabase, not here.',
  },
  paths: {
    '/api/health': {
      get: { summary: 'Liveness', responses: { '200': { description: 'OK' } } },
    },
    '/api/keepalive': {
      post: { summary: 'Touch Supabase heartbeat (API key required)' },
    },
    '/api/tenants/provision': {
      post: { summary: 'Create a tenant when service role is configured' },
    },
    '/api/public-config': {
      get: { summary: 'Public runtime config' },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}
