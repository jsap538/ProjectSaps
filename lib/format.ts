/**
 * Utility functions for formatting (client-safe, no secrets)
 */

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

