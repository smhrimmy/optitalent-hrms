/**
 * Standard Security Headers injected into Next.js middleware / API responses.
 * Protects against XSS, Clickjacking, and MIME-sniffing.
 */

export const SecurityHeaders = {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:;",
    'X-Frame-Options': 'DENY', // Prevents clickjacking by denying iframe embedding
    'X-Content-Type-Options': 'nosniff', // Prevents MIME type sniffing
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload', // HSTS
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()' // Blocks unused browser features
};

/**
 * Helper to apply headers to a standard Response object.
 */
export function applySecurityHeaders(res: Response): Response {
    const headers = new Headers(res.headers);
    Object.entries(SecurityHeaders).forEach(([key, value]) => {
        headers.set(key, value);
    });
    
    return new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers
    });
}
