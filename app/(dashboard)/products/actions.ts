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

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  sku: z.string().optional(),
  description: z.string().optional(),
  unit: z.string().optional(),
  unit_price: z.number().min(0, 'Unit price must be positive'),
  tax_rate: z.number().min(0, 'Tax rate must be positive'),
  active: z.boolean().default(true),
})

export async function createProduct(formData: FormData) {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const rawData = {
    name: formData.get('name') as string,
    sku: formData.get('sku') as string,
    description: formData.get('description') as string,
    unit: formData.get('unit') as string,
    unit_price: parseFloat(formData.get('unit_price') as string) || 0,
    tax_rate: parseFloat(formData.get('tax_rate') as string) || 0,
    active: formData.get('active') === 'on',
  }

  const parsed = productSchema.safeParse(rawData)
  if (!parsed.success) {
    redirect(`/products/new?error=${encodeURIComponent('Invalid product data')}`)
  }

  const data = { ...parsed.data, organization_id: orgId }

  const { error } = await supabase.from('products').insert(data)

  if (error) {
    redirect(`/products/new?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/products')
  redirect('/products')
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  const rawData = {
    name: formData.get('name') as string,
    sku: formData.get('sku') as string,
    description: formData.get('description') as string,
    unit: formData.get('unit') as string,
    unit_price: parseFloat(formData.get('unit_price') as string) || 0,
    tax_rate: parseFloat(formData.get('tax_rate') as string) || 0,
    active: formData.get('active') === 'on',
  }

  const parsed = productSchema.safeParse(rawData)
  if (!parsed.success) {
    redirect(`/products/${id}?error=${encodeURIComponent('Invalid product data')}`)
  }

  const data = {
    ...parsed.data,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('products')
    .update(data)
    .eq('id', id)
    .eq('organization_id', orgId)

  if (error) {
    redirect(`/products/${id}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/products')
  redirect('/products')
}

export async function deleteProduct(id: string) {
  const supabase = await createClient()
  const orgId = await getOrganizationId()

  // Soft delete
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)
    .eq('organization_id', orgId)

  if (error) {
    redirect(`/products?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/products')
}
