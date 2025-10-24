import * as Sentry from '@sentry/nextjs';

export async function register() {
  // Add onRequestError hook for React Server Components
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).onRequestError = (error: Error, request: Request) => {
      Sentry.captureRequestError(error, request);
    };
  }
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://0ddf17bcbee3b77f424b177e304301cb@o4510246744752128.ingest.us.sentry.io/4510246747439104",
      
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Filter out sensitive data
      beforeSend(event) {
        // Remove sensitive fields from server events
        if (event.request?.cookies) {
          delete event.request.cookies;
        }
        
        // Remove sensitive headers
        if (event.request?.headers) {
          const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-stripe-signature'];
          sensitiveHeaders.forEach(header => {
            if (event.request?.headers) {
              delete event.request.headers[header];
            }
          });
        }
        
        return event;
      },
      
      // Set sample rate for performance monitoring
      sampleRate: 1.0,
      
      // Set environment
      environment: process.env.NODE_ENV,
      
      // Add release tracking
      release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      
    });
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://0ddf17bcbee3b77f424b177e304301cb@o4510246744752128.ingest.us.sentry.io/4510246747439104",
      
      // Adjust this value in production, or use tracesSampler for greater control
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      
      // Set environment
      environment: process.env.NODE_ENV,
      
      // Add release tracking
      release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      
    });
  }
}
