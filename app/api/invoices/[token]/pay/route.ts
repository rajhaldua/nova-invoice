import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createAdminClient()

  // 1. Fetch invoice and items
  const { data: invoice } = await supabase
    .from('invoices')
    .select('id, invoice_number, total, public_token, status, invoice_items(description, quantity, unit_price, tax_rate)')
    .eq('public_token', token)
    .single()

  if (!invoice) {
    return new NextResponse('Invoice not found', { status: 404 })
  }

  if (invoice.status === 'paid') {
    return new NextResponse('Invoice is already paid', { status: 400 })
  }

  try {
    // 2. Map invoice items to Stripe line items
    const lineItems = invoice.invoice_items.map((item: { description: string, quantity: number, unit_price: number, tax_rate: number }) => {
      // Calculate amount in cents, including tax
      const unitAmount = item.unit_price * 100
      const taxMultiplier = 1 + (item.tax_rate / 100)
      const amountWithTax = Math.round(unitAmount * taxMultiplier)

      return {
        price_data: {
          currency: 'usd', // Assuming USD for now, could be dynamic
          product_data: {
            name: item.description,
          },
          unit_amount: amountWithTax,
        },
        quantity: item.quantity,
      }
    })

    // 3. Get the base URL
    const origin = request.headers.get('origin') || 'http://localhost:3000'

    // 4. Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/public/invoice/${invoice.public_token}?success=true`,
      cancel_url: `${origin}/public/invoice/${invoice.public_token}?canceled=true`,
      client_reference_id: invoice.id,
      metadata: {
        invoiceId: invoice.id,
      }
    })

    if (!session.url) {
      throw new Error('Failed to create Stripe session URL')
    }

    // Return the URL so the client can redirect
    return NextResponse.redirect(session.url, 303)

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error'
    console.error('Stripe error:', msg)
    return new NextResponse(msg, { status: 500 })
  }
}
