"use client";

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  orderId: string;
}

export default function CheckoutForm({ orderId }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/success?orderId=${orderId}`,
        },
      });

      if (error) {
        // Payment failed
        setErrorMessage(error.message || 'An error occurred');
        setIsLoading(false);
      } else {
        // Payment succeeded, redirect will happen automatically
        // The return_url will be used
      }
    } catch (err) {
      console.error('Payment error:', err);
      setErrorMessage('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div>
        <PaymentElement />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4">
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full rounded-xl bg-titanium text-ink px-6 py-4 text-lg font-semibold shadow-subtle transition-all duration-sap hover:-translate-y-px hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : (
          'Pay Now'
        )}
      </button>

      {/* Test Card Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-nickel bg-graphite/40 rounded-lg p-3 border border-porcelain/5">
          <p className="font-medium mb-1">Test Card:</p>
          <p>Card: 4242 4242 4242 4242</p>
          <p>Expiry: Any future date</p>
          <p>CVC: Any 3 digits</p>
        </div>
      )}

      {/* Trust Signals */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-porcelain/10">
        <div className="flex items-center gap-2 text-nickel text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-2 text-nickel text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span>PCI Compliant</span>
        </div>
      </div>
    </form>
  );
}

