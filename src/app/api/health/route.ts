import { NextResponse } from 'next/server';
import { authorize } from '@/lib/authorization/engine';
import { getCompanyContext } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const context = await getCompanyContext();
  if (!context) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const authResult = authorize({ context, resource: 'system', action: 'view' });
  if (!authResult.allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json({
    ok: true,
    service: 'optitalent-hrms',
    time: new Date().toISOString(),
  });
}
