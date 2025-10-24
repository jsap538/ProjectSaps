"use client";

import { useState } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';
import ErrorFallback from '@/components/ErrorFallback';
import LoadingError from '@/components/LoadingError';
import AsyncWrapper from '@/components/AsyncWrapper';

// Component that throws an error for testing
function ErrorComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error for error boundary testing');
  }
  return <div className="text-porcelain">Component loaded successfully!</div>;
}

// Component that simulates async loading with potential error
function AsyncComponent({ shouldFail }: { shouldFail: boolean }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useState(() => {
    setTimeout(() => {
      if (shouldFail) {
        setError('Simulated async error');
      } else {
        setLoading(false);
      }
    }, 1000);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-titanium border-t-transparent rounded-full animate-spin"></div>
        <span className="ml-2 text-porcelain">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <LoadingError
        onRetry={() => {
          setError(null);
          setLoading(true);
          setTimeout(() => setLoading(false), 1000);
        }}
        context="Async operation failed"
      />
    );
  }

  return <div className="text-porcelain">Async operation completed successfully!</div>;
}

export default function TestErrorRecoveryPage() {
  const [errorBoundaryTest, setErrorBoundaryTest] = useState(false);
  const [asyncTest, setAsyncTest] = useState(false);

  return (
    <div className="min-h-screen bg-ink p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-porcelain mb-8">
          Error Recovery Testing
        </h1>
        
        <div className="space-y-8">
          {/* Error Boundary Test */}
          <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-porcelain mb-4">
              Error Boundary Test
            </h2>
            <p className="text-nickel mb-4">
              Test error boundaries with deliberate errors and recovery.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setErrorBoundaryTest(!errorBoundaryTest)}
                className="rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 font-medium transition-colors duration-sap hover:bg-red-500/30"
              >
                {errorBoundaryTest ? 'Reset Error' : 'Trigger Error'}
              </button>
              
              <ErrorBoundary context="Test Error Boundary">
                <ErrorComponent shouldThrow={errorBoundaryTest} />
              </ErrorBoundary>
            </div>
          </div>

          {/* Async Error Test */}
          <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-porcelain mb-4">
              Async Error Test
            </h2>
            <p className="text-nickel mb-4">
              Test async operations with potential failures and retry functionality.
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => setAsyncTest(!asyncTest)}
                className="rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 px-4 py-2 font-medium transition-colors duration-sap hover:bg-blue-500/30"
              >
                {asyncTest ? 'Test Success' : 'Test Failure'}
              </button>
              
              <AsyncWrapper context="Async operation">
                <AsyncComponent shouldFail={asyncTest} />
              </AsyncWrapper>
            </div>
          </div>

          {/* Manual Error Fallback Test */}
          <div className="bg-graphite/60 border border-porcelain/10 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-porcelain mb-4">
              Manual Error Fallback Test
            </h2>
            <p className="text-nickel mb-4">
              Test the ErrorFallback component directly.
            </p>
            
            <ErrorFallback
              error={new Error('Manual test error')}
              resetError={() => console.log('Reset clicked')}
              context="Manual test error"
              showDetails={true}
            />
          </div>

          {/* Instructions */}
          <div className="bg-titanium/10 border border-titanium/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-porcelain mb-4">
              Testing Instructions
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-nickel">
              <li>Click "Trigger Error" to test error boundary recovery</li>
              <li>Click "Test Failure" to test async error handling</li>
              <li>Use "Try again" buttons to test retry functionality</li>
              <li>Check browser console for error logs</li>
              <li>Verify Sentry dashboard for error tracking</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
