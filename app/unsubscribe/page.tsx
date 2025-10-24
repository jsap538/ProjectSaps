"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const email = searchParams.get('email');
  const type = searchParams.get('type') || 'all';

  useEffect(() => {
    if (!email) {
      setStatus('error');
      setMessage('Invalid unsubscribe link');
      return;
    }

    // In a real implementation, you'd call an API to unsubscribe the user
    const unsubscribe = async () => {
      try {
        const response = await fetch('/api/email/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, type }),
        });

        if (response.ok) {
          setStatus('success');
          setMessage(`You have been unsubscribed from ${type} emails.`);
        } else {
          setStatus('error');
          setMessage('Failed to unsubscribe. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An error occurred. Please try again.');
      }
    };

    unsubscribe();
  }, [email, type]);

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-graphite/60 border border-porcelain/10 rounded-xl p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-titanium/10 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-titanium border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-2xl font-semibold text-porcelain mb-2">
            Processing...
          </h1>
          <p className="text-nickel">Please wait while we process your request.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-porcelain mb-2">
              Unsubscribed Successfully
            </h1>
            <p className="text-nickel mb-6">{message}</p>
            <a
              href="/"
              className="inline-block rounded-xl bg-titanium text-ink px-6 py-3 font-medium transition-colors duration-sap hover:bg-titanium/90"
            >
              Return to Homepage
            </a>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-porcelain mb-2">
              Error
            </h1>
            <p className="text-nickel mb-6">{message}</p>
            <a
              href="/"
              className="inline-block rounded-xl bg-titanium text-ink px-6 py-3 font-medium transition-colors duration-sap hover:bg-titanium/90"
            >
              Return to Homepage
            </a>
          </>
        )}
      </div>
    </div>
  );
}
