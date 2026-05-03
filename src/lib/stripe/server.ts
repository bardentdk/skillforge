import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-04-22.dahlia',
//   apiVersion: '2025-09-30.clover',
  typescript: true,
  appInfo: {
    name: 'Learnova',
    version: '1.0.0',
  },
})

/**
 * Convertit un montant en EUR vers cents Stripe
 * 49.99 → 4999
 */
export function toStripeAmount(amount: number): number {
  return Math.round(amount * 100)
}

/**
 * Convertit cents Stripe vers EUR
 * 4999 → 49.99
 */
export function fromStripeAmount(amount: number): number {
  return amount / 100
}