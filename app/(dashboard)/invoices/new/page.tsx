import { createClient } from '@/lib/supabase/server'
import { InvoiceForm } from '@/components/invoices/InvoiceForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function NewInvoicePage() {
  const supabase = await createClient()

  // Get current user's organization
  const { data: { user } } = await supabase.auth.getUser()
  const { data: members } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user?.id || '')
    .limit(1)
    .single()

  const orgId = members?.organization_id

  if (!orgId) redirect('/onboarding')

  // Fetch active customers
  const { data: customers } = await supabase
    .from('customers')
    .select('id, name, company_name')
    .eq('organization_id', orgId)
    .is('deleted_at', null)
    .order('name')

  // Fetch active products
  const { data: products } = await supabase
    .from('products')
    .select('id, name, unit_price, tax_rate')
    .eq('organization_id', orgId)
    .eq('active', true)
    .is('deleted_at', null)
    .order('name')

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/invoices">
          <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
      </div>

      <InvoiceForm customers={customers || []} products={products || []} />
    </div>
  )
}
