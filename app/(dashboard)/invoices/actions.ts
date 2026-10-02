'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function getOrganizationId() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: members } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  if (!members) throw new Error('No organization found')
  return members.organization_id
}

export async function createInvoice(data: any) {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const { customer_id, issue_date, due_date, items, ...totals } = data

  // 1. Create Invoice
  const invoiceNumber = `INV-${new Date().getTime().toString().slice(-6)}`
  
  const invoicePayload = {
    organization_id: orgId,
    customer_id,
    invoice_number: invoiceNumber,
    issue_date,
    due_date,
    ...totals,
    status: 'draft',
  }

  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert(invoicePayload)
    .select('id')
    .single()

  if (invoiceError) return { error: invoiceError.message }

  // 2. Create Invoice Items
  const invoiceItemsPayload = items.map((item: any, index: number) => ({
    invoice_id: invoice.id,
    product_id: item.product_id,
    description: item.description,
    quantity: item.quantity,
    unit_price: item.unit_price,
    tax_rate: item.tax_rate,
    line_total: item.line_total,
    sort_order: index
  }))

  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(invoiceItemsPayload)

  if (itemsError) return { error: itemsError.message }

  revalidatePath('/invoices')
  redirect('/invoices')
}

export async function markAsSent(id: string) {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const { error } = await supabase
    .from('invoices')
    .update({ status: 'sent' })
    .eq('id', id)
    .eq('organization_id', orgId)

  if (error) return { error: error.message }
  revalidatePath('/invoices')
}

export async function markAsPaid(id: string, amount: number) {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const { error } = await supabase
    .from('invoices')
    .update({ 
      status: 'paid',
      amount_paid: amount,
      amount_due: 0
    })
    .eq('id', id)
    .eq('organization_id', orgId)

  if (error) return { error: error.message }
  revalidatePath('/invoices')
}
