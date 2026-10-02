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

export async function createCustomer(formData: FormData) {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const data = {
    organization_id: orgId,
    name: formData.get('name') as string,
    company_name: formData.get('company_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    tax_id: formData.get('tax_id') as string,
    currency: formData.get('currency') as string,
    billing_address: formData.get('billing_address') as string,
  }

  const { error } = await supabase.from('customers').insert(data)

  if (error) {
    redirect(`/customers/new?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/customers')
  redirect('/customers')
}

export async function updateCustomer(id: string, formData: FormData) {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const data = {
    name: formData.get('name') as string,
    company_name: formData.get('company_name') as string,
    email: formData.get('email') as string,
    phone: formData.get('phone') as string,
    tax_id: formData.get('tax_id') as string,
    currency: formData.get('currency') as string,
    billing_address: formData.get('billing_address') as string,
    updated_at: new Date().toISOString(),
  }

  // RLS ensures they can only update customers belonging to their org
  const { error } = await supabase
    .from('customers')
    .update(data)
    .eq('id', id)
    .eq('organization_id', orgId)

  if (error) {
    redirect(`/customers/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/customers')
  redirect('/customers')
}

export async function deleteCustomer(id: string) {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  // Soft delete
  const { error } = await supabase
    .from('customers')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('organization_id', orgId)

  if (error) {
    redirect(`/customers?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/customers')
}
