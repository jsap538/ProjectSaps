'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink">
      <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-8 max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-semibold text-porcelain mb-2">
            Something went wrong
          </h2>
          
          <p className="text-nickel mb-6">
            We're sorry, but something unexpected happened. Our team has been notified and is working to fix this issue.
          </p>
          
          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full rounded-xl bg-titanium text-ink px-4 py-3 font-medium transition-colors duration-sap hover:bg-titanium/90"
            >
              Try again
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full rounded-xl bg-graphite/60 border border-porcelain/20 text-porcelain px-4 py-3 font-medium transition-colors duration-sap hover:bg-graphite/80"
            >
              Go to homepage
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="mt-6 text-left">
              <summary className="text-sm text-nickel cursor-pointer hover:text-porcelain">
                Error details (development only)
              </summary>
              <pre className="mt-2 text-xs text-nickel bg-ink/50 p-3 rounded overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}

