import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = createAdminClient()

  // 1. Fetch the invoice to verify it exists
  const { data: invoice } = await supabase
    .from('invoices')
    .select('invoice_number')
    .eq('public_token', token)
    .single()

  if (!invoice) {
    return new NextResponse('Invoice not found', { status: 404 })
  }

  // NOTE: In a production Vercel environment, you would typically use 
  // @vercel/og or a service like API2PDF, Puppeteer-core with Chromium, 
  // or pdfme to generate the PDF buffer.
  // 
  // For the MVP, we instruct the user to use the browser's built-in 
  // Print to PDF functionality on the public invoice page, or we integrate
  // a third party service here.

  return NextResponse.json({
    message: "PDF generation endpoint ready.",
    instruction: "Integrate 'puppeteer-core' or 'pdfme' here to stream the PDF buffer back to the client.",
    invoice: invoice.invoice_number
  })
}
