'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { createClient } from '@/lib/supabase/server'
import { stripe, toStripeAmount } from '@/lib/stripe/server'
import { fetchCart } from '@/lib/queries/cart'
import { ROUTES } from '@/lib/constants'
import type { OrderInsert } from '@/types/database'

export type ActionResult<T = unknown> =
  | { success: true; data?: T }
  | { success: false; error: string }

// ════════════════════════════════════════════════════
// ADD TO CART
// ════════════════════════════════════════════════════
export async function addToCartAction(courseId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Tu dois être connecté pour ajouter au panier' }
  }

  // Vérif : user pas déjà inscrit ?
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', user.id)
    .eq('course_id', courseId)
    .eq('status', 'ACTIVE')
    .maybeSingle()

  if (enrollment) {
    return { success: false, error: 'Tu es déjà inscrit·e à ce cours' }
  }

  const { error } = await supabase
    .from('cart_items')
    // @ts-expect-error - Supabase ssr typing limitation
    .insert({ user_id: user.id, course_id: courseId })

  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Ce cours est déjà dans ton panier' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/cart')
  revalidatePath('/', 'layout')
  return { success: true }
}

// ════════════════════════════════════════════════════
// REMOVE FROM CART
// ════════════════════════════════════════════════════
export async function removeFromCartAction(cartItemId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Non authentifié' }
  }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/cart')
  revalidatePath('/', 'layout')
  return { success: true }
}

// ════════════════════════════════════════════════════
// CLEAR CART
// ════════════════════════════════════════════════════
export async function clearCartAction(): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Non authentifié' }

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/cart')
  revalidatePath('/', 'layout')
  return { success: true }
}

// ════════════════════════════════════════════════════
// CREATE STRIPE CHECKOUT SESSION
// ════════════════════════════════════════════════════
export async function createCheckoutSessionAction(
  courseId?: string  // Si fourni : achat direct du cours, sinon : checkout du cart entier
): Promise<ActionResult<{ url: string }>> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Tu dois être connecté pour acheter' }
  }

  const headersList = await headers()
  const origin = headersList.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  let coursesToBuy: Array<{ id: string; title: string; price: number; thumbnail_url: string | null }> = []

  if (courseId) {
    // Achat direct d'un cours
    const { data: course } = await supabase
      .from('courses')
      .select('id, title, price, thumbnail_url, status')
      .eq('id', courseId)
      .eq('status', 'PUBLISHED')
      .single()

    if (!course) {
      return { success: false, error: 'Cours introuvable' }
    }

    // Check pas déjà enrolled
    const { data: enrollment } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('status', 'ACTIVE')
      .maybeSingle()

    if (enrollment) {
      return { success: false, error: 'Tu es déjà inscrit·e à ce cours' }
    }

    coursesToBuy = [course]
  } else {
    // Checkout du cart
    const cart = await fetchCart(user.id)

    if (cart.items.length === 0) {
      return { success: false, error: 'Ton panier est vide' }
    }

    coursesToBuy = cart.items.map((item) => ({
      id: item.course.id,
      title: item.course.title,
      price: item.course.price,
      thumbnail_url: item.course.thumbnail_url,
    }))
  }

  const totalAmount = coursesToBuy.reduce((sum, c) => sum + c.price, 0)

  // Create order in DB (pending)
  const orderData: OrderInsert = {
    user_id: user.id,
    total_amount: totalAmount,
    course_ids: coursesToBuy.map((c) => c.id),
    status: 'PENDING',
    currency: 'EUR',
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    // @ts-expect-error - Supabase ssr typing limitation
    .insert(orderData)
    .select('id')
    .single()

  if (orderError || !order) {
    console.error('[Stripe] Failed to create order:', orderError)
    return { success: false, error: "Impossible de créer la commande" }
  }

  // Create Stripe checkout session
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: coursesToBuy.map((course) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: course.title,
            images: course.thumbnail_url ? [course.thumbnail_url] : undefined,
          },
          unit_amount: toStripeAmount(course.price),
        },
        quantity: 1,
      })),
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        order_id: (order as { id: string }).id,
        course_ids: coursesToBuy.map((c) => c.id).join(','),
      },
      payment_intent_data: {
        metadata: {
          user_id: user.id,
          order_id: (order as { id: string }).id,
          course_ids: coursesToBuy.map((c) => c.id).join(','),
        },
      },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel?order_id=${(order as { id: string }).id}`,
      locale: 'fr',
    })

    // Update order with session ID
    await supabase
      .from('orders')
      // @ts-expect-error - Supabase ssr typing limitation
      .update({ stripe_session_id: session.id })
      .eq('id', (order as { id: string }).id)

    if (!session.url) {
      return { success: false, error: 'Stripe checkout URL missing' }
    }

    return { success: true, data: { url: session.url } }
  } catch (err) {
    console.error('[Stripe] Checkout session error:', err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Erreur Stripe',
    }
  }
}

// ════════════════════════════════════════════════════
// CHECKOUT REDIRECT (helper qui redirect direct)
// ════════════════════════════════════════════════════
export async function redirectToCheckoutAction(courseId?: string) {
  const result = await createCheckoutSessionAction(courseId)
  if (result.success && result.data) {
    redirect(result.data.url)
  }
  // Si erreur, le client la récupère
  return result
}