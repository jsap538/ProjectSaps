import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

/**
 * Server-side Stripe instance
 * Used in API routes only - never expose to client
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
  appInfo: {
    name: 'SAPS Marketplace',
    version: '1.0.0',
  },
});

/**
 * Calculate platform fee (10% of subtotal)
 */
export function calculatePlatformFee(subtotal_cents: number): number {
  return Math.round(subtotal_cents * 0.10);
}

/**
 * Calculate Stripe processing fee estimate
 * Stripe charges: 2.9% + $0.30
 */
export function estimateStripeFee(total_cents: number): number {
  return Math.round(total_cents * 0.029 + 30);
}

/**
 * Format amount for display ($XX.XX)
 */
export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

