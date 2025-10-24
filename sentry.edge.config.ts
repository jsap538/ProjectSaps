import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://0ddf17bcbee3b77f424b177e304301cb@o4510246744752128.ingest.us.sentry.io/4510246747439104",
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Set environment
  environment: process.env.NODE_ENV,
  
  // Add release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
});

