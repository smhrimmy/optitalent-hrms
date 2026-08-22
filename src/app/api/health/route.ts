import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'optitalent-hrms',
    time: new Date().toISOString(),
  });
}
