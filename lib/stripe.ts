import Stripe from 'stripe';

/**
 * Server-side Stripe instance
 * ⚠️ NEVER import this in client components!
 * Only use in API routes (app/api/**)
 */

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in server environment');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
  appInfo: {
    name: 'Encore Marketplace',
    version: '1.0.0',
  },
});

// Re-export utility functions from format.ts for convenience
export { calculatePlatformFee, estimateStripeFee, formatCurrency } from './format';

