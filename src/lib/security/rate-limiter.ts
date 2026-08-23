/**
 * A centralized Global Rate Limiter to protect API endpoints and Webhook listeners.
 */

export interface RateLimitConfig {
    maxRequests: number;
    windowMs: number;
}

export class GlobalRateLimiter {
    // MOCK in-memory store for rate limiting tokens
    private static store: Record<string, { count: number, resetTime: number }> = {};

    static readonly TIERS: Record<string, RateLimitConfig> = {
        'API_PUBLIC': { maxRequests: 100, windowMs: 60000 },       // 100 req / minute
        'API_WEBHOOK': { maxRequests: 500, windowMs: 60000 },      // 500 req / minute
        'AUTH_LOGIN': { maxRequests: 5, windowMs: 300000 },        // 5 req / 5 minutes
        'AI_INFERENCE': { maxRequests: 10, windowMs: 60000 }       // 10 AI invocations / minute
    };

    /**
     * Checks if the request should be rate-limited.
     * Throws an error if the limit is exceeded.
     */
    static enforce(identifier: string, tier: keyof typeof GlobalRateLimiter.TIERS = 'API_PUBLIC') {
        const config = this.TIERS[tier];
        const now = Date.now();
        const record = this.store[identifier];

        if (!record || now > record.resetTime) {
            // New window
            this.store[identifier] = { count: 1, resetTime: now + config.windowMs };
            return;
        }

        if (record.count >= config.maxRequests) {
            console.warn(`[Security] Rate limit exceeded for ${identifier} in tier ${tier}`);
            throw new Error(`429 Too Many Requests: Limit of ${config.maxRequests} per window exceeded.`);
        }

        record.count++;
    }
}
