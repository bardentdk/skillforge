import { NextResponse, type NextRequest } from 'next/server'
import { headers } from 'next/headers'
import type Stripe from 'stripe'

import { stripe, fromStripeAmount } from '@/lib/stripe/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { EnrollmentInsert } from '@/types/database'

type SupabaseAdminClient = {
  from: (table: string) => any
  rpc: (fn: string, args?: Record<string, unknown>) => any
}

type CourseStudentsCountRow = {
  students_count: number | null
}

type OrderRefundRow = {
  id: string
  user_id: string
  course_ids: string[] | null
}

function getSupabaseAdmin() {
  return createAdminClient() as unknown as SupabaseAdminClient
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    console.error('[Webhook] STRIPE_WEBHOOK_SECRET not configured')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'

    console.error('[Webhook] Signature verification failed:', message)

    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    )
  }

  console.log(`[Webhook] Received event: ${event.type}`)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        )
        break

      case 'checkout.session.expired':
        await handleCheckoutSessionExpired(
          event.data.object as Stripe.Checkout.Session
        )
        break

      case 'payment_intent.payment_failed':
        await handlePaymentFailed(
          event.data.object as Stripe.PaymentIntent
        )
        break

      case 'charge.refunded':
        await handleRefund(
          event.data.object as Stripe.Charge
        )
        break

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'

    console.error('[Webhook] Handler error:', message)

    return NextResponse.json(
      { error: `Handler Error: ${message}` },
      { status: 500 }
    )
  }
}

// ════════════════════════════════════════════════════
// CHECKOUT SESSION COMPLETED → Crée enrollments + clean cart
// ════════════════════════════════════════════════════
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const supabase = getSupabaseAdmin()

  const userId = session.metadata?.user_id
  const orderId = session.metadata?.order_id
  const courseIdsStr = session.metadata?.course_ids

  if (!userId || !orderId || !courseIdsStr) {
    console.error('[Webhook] Missing metadata in session:', session.id)
    return
  }

  const courseIds = courseIdsStr.split(',').filter(Boolean)

  const amountPaid = session.amount_total
    ? fromStripeAmount(session.amount_total)
    : 0

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id

  console.log(
    `[Webhook] Processing payment for user ${userId}, courses: ${courseIds.join(', ')}`
  )

  // 1. Update order status
  await supabase
    .from('orders')
    .update({
      status: 'COMPLETED',
      stripe_payment_intent_id: paymentIntentId ?? null,
      completed_at: new Date().toISOString(),
    })
    .eq('id', orderId)

  // 2. Create enrollments (one per course)
  const pricePerCourse = courseIds.length > 0 ? amountPaid / courseIds.length : 0

  const enrollments = courseIds.map((courseId) => ({
    user_id: userId,
    course_id: courseId,
    status: 'ACTIVE',
    amount_paid: pricePerCourse,
  })) satisfies EnrollmentInsert[]

  const { error: enrollmentError } = await supabase
    .from('enrollments')
    .upsert(enrollments, {
      onConflict: 'user_id,course_id',
      ignoreDuplicates: false,
    })

  if (enrollmentError) {
    console.error('[Webhook] Failed to create enrollments:', enrollmentError)

    throw new Error(
      `Enrollment creation failed: ${enrollmentError.message}`
    )
  }

  // 3. Update students_count on each course
  for (const courseId of courseIds) {
    try {
      const { error } = await supabase.rpc('increment_students_count', {
        course_id: courseId,
      })

      if (error) {
        throw new Error(error.message)
      }
    } catch {
      // Si la fonction SQL n'existe pas, fallback manuel
      const { data: course } = await supabase
        .from('courses')
        .select('students_count')
        .eq('id', courseId)
        .single()

      const typedCourse = course as CourseStudentsCountRow | null

      if (typedCourse) {
        await supabase
          .from('courses')
          .update({
            students_count: (typedCourse.students_count ?? 0) + 1,
          })
          .eq('id', courseId)
      }
    }
  }

  // 4. Clean up cart items for these courses
  await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .in('course_id', courseIds)

  console.log(
    `[Webhook] ✅ ${courseIds.length} enrollments created for user ${userId}`
  )
}

// ════════════════════════════════════════════════════
// SESSION EXPIRED → Mark order as failed
// ════════════════════════════════════════════════════
async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  const supabase = getSupabaseAdmin()

  const orderId = session.metadata?.order_id

  if (!orderId) {
    return
  }

  await supabase
    .from('orders')
    .update({
      status: 'FAILED',
    })
    .eq('id', orderId)

  console.log(`[Webhook] Session expired, order ${orderId} marked as FAILED`)
}

// ════════════════════════════════════════════════════
// PAYMENT FAILED
// ════════════════════════════════════════════════════
async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const supabase = getSupabaseAdmin()

  const orderId = paymentIntent.metadata?.order_id

  if (!orderId) {
    return
  }

  await supabase
    .from('orders')
    .update({
      status: 'FAILED',
      stripe_payment_intent_id: paymentIntent.id,
    })
    .eq('id', orderId)

  console.log(`[Webhook] Payment failed for order ${orderId}`)
}

// ════════════════════════════════════════════════════
// REFUND → Mark order as refunded + cancel enrollments
// ════════════════════════════════════════════════════
async function handleRefund(charge: Stripe.Charge) {
  const supabase = getSupabaseAdmin()

  const paymentIntentId =
    typeof charge.payment_intent === 'string'
      ? charge.payment_intent
      : charge.payment_intent?.id

  if (!paymentIntentId) {
    return
  }

  const { data: orderData } = await supabase
    .from('orders')
    .select('id, user_id, course_ids')
    .eq('stripe_payment_intent_id', paymentIntentId)
    .single()

  const order = orderData as OrderRefundRow | null

  if (!order) {
    return
  }

  await supabase
    .from('orders')
    .update({
      status: 'REFUNDED',
    })
    .eq('id', order.id)

  // Cancel enrollments
  if (order.course_ids && order.course_ids.length > 0) {
    await supabase
      .from('enrollments')
      .update({
        status: 'REFUNDED',
      })
      .eq('user_id', order.user_id)
      .in('course_id', order.course_ids)
  }

  console.log(`[Webhook] Refund processed for order ${order.id}`)
}