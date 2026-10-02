import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()

  let event: Stripe.Event

  try {
    // In production, ALWAYS verify the webhook signature!
    // const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    // event = stripe.webhooks.constructEvent(body, signature!, endpointSecret);
    
    // For MVP testing without a webhook secret, we'll parse it directly
    event = JSON.parse(body) as Stripe.Event
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Webhook Error: ${msg}`)
    return new NextResponse(`Webhook Error: ${msg}`, { status: 400 })
  }

  const supabase = createAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const invoiceId = session.metadata?.invoiceId

    if (invoiceId) {
      // Mark invoice as paid
      const { error } = await supabase
        .from('invoices')
        .update({ 
          status: 'paid',
          amount_paid: session.amount_total ? session.amount_total / 100 : 0,
          amount_due: 0
        })
        .eq('id', invoiceId)

      if (error) {
        console.error('Error updating invoice:', error)
        return new NextResponse('Database error', { status: 500 })
      }
      // Successfully marked as paid
    }
  }

  return NextResponse.json({ received: true })
}
