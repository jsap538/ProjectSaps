import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://0ddf17bcbee3b77f424b177e304301cb@o4510246744752128.ingest.us.sentry.io/4510246747439104",
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // You can remove this option if you're not planning to use the Sentry webpack plugin
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  
  // Filter out sensitive data
  beforeSend(event) {
    // Remove sensitive fields
    if (event.request?.cookies) {
      delete event.request.cookies;
    }
    
    // Remove sensitive headers
    if (event.request?.headers) {
      const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];
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

