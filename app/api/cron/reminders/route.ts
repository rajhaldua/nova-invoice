import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Optional: Vercel Cron secures the endpoint via a CRON_SECRET header
// We skip it here for local MVP testing, but in production, you should verify it.

export async function GET() {
  const supabase = createAdminClient()

  // 1. Find all invoices that are past their due_date and still in 'sent' or 'draft' status
  const today = new Date().toISOString().split('T')[0]

  const { data: overdueInvoices, error } = await supabase
    .from('invoices')
    .select('id, invoice_number, due_date, status, customers(email, name)')
    .in('status', ['sent', 'draft'])
    .lt('due_date', today)

  if (error) {
    console.error('Failed to fetch overdue invoices:', error)
    return new NextResponse('Internal error', { status: 500 })
  }

  // 2. Mark them as 'overdue' and simulate sending an email reminder
  const processed = []

  for (const invoice of overdueInvoices || []) {
    // Update status to overdue
    await supabase
      .from('invoices')
      .update({ status: 'overdue' })
      .eq('id', invoice.id)

    // Simulate sending an email reminder
    // Reminder sent successfully
    
    processed.push(invoice.invoice_number)
  }

  return NextResponse.json({
    message: 'Cron job completed',
    processed_count: processed.length,
    processed_invoices: processed
  })
}
