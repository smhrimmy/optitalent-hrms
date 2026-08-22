import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: 'optitalent-hrms',
    time: new Date().toISOString(),
  });
}
