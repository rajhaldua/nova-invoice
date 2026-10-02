'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

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

const invoiceItemSchema = z.object({
  product_id: z.string().uuid(),
  description: z.string().min(1),
  quantity: z.number().positive(),
  unit_price: z.number().min(0),
  tax_rate: z.number().min(0),
  line_total: z.number().min(0)
})

const createInvoiceSchema = z.object({
  customer_id: z.string().uuid(),
  issue_date: z.string(),
  due_date: z.string(),
  subtotal: z.number().min(0),
  tax_total: z.number().min(0),
  total: z.number().min(0),
  amount_due: z.number().min(0),
  items: z.array(invoiceItemSchema).min(1)
})

export async function createInvoice(rawData: any) {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const parsed = createInvoiceSchema.safeParse(rawData)
  if (!parsed.success) {
    return { error: 'Invalid invoice data' }
  }

  const data = parsed.data
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

export async function markAsSent(id: string, formData?: FormData) {
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

export async function markAsPaid(id: string, amount: number, formData?: FormData) {
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

export async function deleteInvoice(id: string, formData?: FormData) {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  // Soft delete by setting deleted_at
  const { error } = await supabase
    .from('invoices')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('organization_id', orgId)

  if (error) return { error: error.message }
  
  revalidatePath('/invoices')
  redirect('/invoices')
}
