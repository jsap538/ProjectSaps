import { NextRequest, NextResponse } from 'next/server';
// import { headers } from 'next/headers';

// Security headers configuration
export const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com https://*.clerk.dev;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https: blob:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.clerk.dev https://*.clerk.com wss://*.clerk.dev;
    frame-src 'self' https://*.clerk.dev https://*.clerk.com;
  `.replace(/\s+/g, ' ').trim(),
};

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
};

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, ''); // Remove event handlers
}

// Validate file upload
export function validateFileUpload(file: File): { isValid: boolean; error?: string } {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' };
  }

  if (file.size > maxSize) {
    return { isValid: false, error: 'File too large. Maximum size is 5MB.' };
  }

  return { isValid: true };
}

// Security middleware for API routes
export function withSecurity(handler: (request: NextRequest, ...args: unknown[]) => Promise<NextResponse>) {
  return async (request: NextRequest, ...args: unknown[]) => {
    const response = NextResponse.next();
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });

    // Check for suspicious patterns in request
    const _url = request.url;
    const userAgent = request.headers.get('user-agent') || '';
    
    // Whitelist legitimate bots/crawlers for SEO
    const legitimateBots = [
      /googlebot/i,
      /bingbot/i,
      /yandex/i,
      /baiduspider/i,
      /duckduckbot/i,
      /slurp/i, // Yahoo
      /twitterbot/i,
      /facebookexternalhit/i,
      /linkedinbot/i,
      /whatsapp/i,
      /applebot/i,
    ];
    
    const isLegitimateBot = legitimateBots.some(pattern => pattern.test(userAgent));
    
    // Only block malicious scrapers, not legitimate bots
    const maliciousPatterns = [
      /scrapy/i,
      /selenium/i,
      /phantomjs/i,
      /headless/i,
      /python-requests/i,
      /curl/i,
      /wget/i,
      /axios/i, // Raw axios without proper user agent
    ];
    
    // Allow legitimate bots, block suspicious ones
    if (!isLegitimateBot && maliciousPatterns.some(pattern => pattern.test(userAgent))) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return handler(request, ...args);
  };
}

// Validate MongoDB ObjectId
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id);
}

// CORS configuration for API routes
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_APP_URL || 'https://your-domain.com'
    : 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};
