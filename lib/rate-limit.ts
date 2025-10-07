import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message?: string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (in production, use Redis or similar)
const store: RateLimitStore = {};

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  private getClientId(request: NextRequest): string {
    // Try to get real IP from various headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfConnectingIp = request.headers.get('cf-connecting-ip');
    
    const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
    return ip;
  }

  private cleanup(): void {
    const now = Date.now();
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    });
  }

  check(request: NextRequest): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    message?: string;
  } {
    this.cleanup();
    
    const clientId = this.getClientId(request);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    if (!store[clientId] || store[clientId].resetTime < now) {
      store[clientId] = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
    } else {
      store[clientId].count++;
    }

    const isAllowed = store[clientId].count <= this.config.maxRequests;
    const remaining = Math.max(0, this.config.maxRequests - store[clientId].count);

    return {
      allowed: isAllowed,
      remaining,
      resetTime: store[clientId].resetTime,
      message: isAllowed ? undefined : this.config.message,
    };
  }
}

// Pre-configured rate limiters
export const rateLimiters = {
  // General API rate limiting
  general: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests, please try again later.',
  }),

  // Strict rate limiting for auth endpoints
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 10,
    message: 'Too many authentication attempts, please try again later.',
  }),

  // Moderate rate limiting for uploads
  upload: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20,
    message: 'Too many upload attempts, please try again later.',
  }),

  // Strict rate limiting for item creation
  createItem: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 5,
    message: 'Too many item creation attempts, please try again later.',
  }),
};

// Middleware helper
export function withRateLimit(
  rateLimiter: RateLimiter,
  handler: (request: NextRequest, ...args: any[]) => Promise<Response>
) {
  return async (request: NextRequest, ...args: any[]): Promise<Response> => {
    const result = rateLimiter.check(request);

    if (!result.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          message: result.message,
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': (rateLimiter as any).config.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime.toString(),
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          },
        }
      );
    }

    const response = await handler(request, ...args);
    
    // Add rate limit headers to successful responses
    response.headers.set('X-RateLimit-Limit', (rateLimiter as any).config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());

    return response;
  };
}
