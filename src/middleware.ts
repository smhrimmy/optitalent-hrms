
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// BEGINNER NOTE:
// Middleware runs before every request to your application.
// We use it here to add security layers and handle routing logic.

// Simple in-memory store for Rate Limiting (Note: Use Redis for production)
const rateLimitStore = new Map();

export function middleware(request: NextRequest) {
  // 1. RATE LIMITING (Prevent abuse)
  // We track requests by IP address to stop spam.
  const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
  const limit = 100; // Max requests per minute
  const windowMs = 60 * 1000; // 1 minute window
  const now = Date.now();

  const record = rateLimitStore.get(ip) || { count: 0, startTime: now };

  if (now - record.startTime > windowMs) {
    // Reset the counter if the window has passed
    record.count = 1;
    record.startTime = now;
  } else {
    record.count++;
  }
  
  rateLimitStore.set(ip, record);

  // If too many requests, block them
  if (record.count > limit) {
    return NextResponse.redirect(new URL('/errors/429', request.url));
  }

  // 2. MAINTENANCE MODE
  // Useful when you are updating the site.
  const isMaintenanceMode = false; // Set to true to enable
  if (isMaintenanceMode && !request.nextUrl.pathname.startsWith('/maintenance')) {
     return NextResponse.redirect(new URL('/maintenance', request.url));
  }

  const lockdown = request.cookies.get('ot_lockdown')?.value === '1';
  const path = request.nextUrl.pathname;
  const lockdownAllowed =
    path.startsWith('/login') ||
    path.startsWith('/mfa') ||
    path.startsWith('/suspended') ||
    path.includes('/super-admin/security') ||
    path === '/' ||
    path.startsWith('/privacy') ||
    path.startsWith('/help');
  if (lockdown && !lockdownAllowed) {
    return NextResponse.redirect(new URL('/suspended', request.url));
  }

  // 3. SECURITY HEADERS (Hacker Proofing)
  const response = NextResponse.next();
  
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.googleapis.com",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );
  
  // 4. MULTI-TENANCY (Enterprise Feature)
  // We check the subdomain to know which company is accessing the app.
  const hostname = request.headers.get('host') || '';
  const subdomain = hostname.split('.')[0];
  
  // If it's a tenant subdomain (not www or localhost), we pass it to the app
  if (subdomain && subdomain !== 'www' && subdomain !== 'localhost') {
      response.headers.set('x-tenant-id', subdomain);
  }

  return response;
}

// Configuration for where middleware should run
export const config = {
  matcher: [
    // Apply to all paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
